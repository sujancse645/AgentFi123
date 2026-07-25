import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { ActionKind } from "@/lib/intentParser";

export type TransactionStatus = "pending" | "confirmed" | "failed";

export interface Transaction {
  id: string;
  signature: string;
  type: ActionKind;
  status: TransactionStatus;
  fromToken: string;
  fromAmount: number;
  toToken: string;
  toAmount: number;
  usdValue: number;
  timestamp: number;
  intent: string;
  riskLevel: "safe" | "caution" | "danger";
  route: string;
  networkFee: number;
}

const STORAGE_KEY = "agentfi_transactions";

export function useTransactions() {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load transactions from localStorage
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const allTxs: Transaction[] = JSON.parse(stored);
          // Filter by current wallet if connected
          if (publicKey) {
            const walletKey = publicKey.toBase58();
            setTransactions(
              allTxs.filter(
                (tx) => !tx.id.includes(":") || tx.id.startsWith(walletKey)
              )
            );
          } else {
            setTransactions(allTxs);
          }
        }
      } catch {
        console.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [publicKey]);

  // Add a new transaction
  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    const newTx: Transaction = {
      ...tx,
      id: `${publicKey?.toBase58() || "anon"}:${Date.now()}:${Math.random().toString(36).slice(2)}`,
    };

    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      // Persist to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allTxs: Transaction[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify([newTx, ...allTxs]));
      } catch {
        console.error("Failed to save transaction");
      }
      return updated;
    });

    return newTx;
  }, [publicKey]);

  // Update transaction status
  const updateTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setTransactions((prev) => {
        const updated = prev.map((tx) =>
          tx.id === id ? { ...tx, ...updates } : tx
        );
        // Persist updates
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          const allTxs: Transaction[] = stored ? JSON.parse(stored) : [];
          const otherTxs = allTxs.filter((tx) => tx.id !== id);
          const updatedTx = allTxs.find((tx) => tx.id === id);
          if (updatedTx) {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify([{ ...updatedTx, ...updates }, ...otherTxs])
            );
          }
        } catch {
          console.error("Failed to update transaction");
        }
        return updated;
      });
    },
    []
  );

  // Clear all transactions
  const clearTransactions = useCallback(() => {
    setTransactions([]);
    try {
      if (publicKey) {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allTxs: Transaction[] = stored ? JSON.parse(stored) : [];
        const walletKey = publicKey.toBase58();
        const otherTxs = allTxs.filter(
          (tx) => !tx.id.startsWith(walletKey)
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(otherTxs));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      console.error("Failed to clear transactions");
    }
  }, [publicKey]);

  // Stats
  const stats = {
    total: transactions.length,
    successful: transactions.filter((t) => t.status === "confirmed").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    failed: transactions.filter((t) => t.status === "failed").length,
    totalVolume: transactions
      .filter((t) => t.status === "confirmed")
      .reduce((sum, t) => sum + t.usdValue, 0),
    last24h: transactions.filter(
      (t) => Date.now() - t.timestamp < 24 * 60 * 60 * 1000
    ).length,
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    clearTransactions,
    stats,
  };
}
