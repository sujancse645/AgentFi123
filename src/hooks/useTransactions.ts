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

const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: "dummy-1",
    signature: "5rK...9pA",
    type: "swap",
    status: "confirmed",
    fromToken: "USDC",
    fromAmount: 1000,
    toToken: "SOL",
    toAmount: 6.5,
    usdValue: 1000,
    timestamp: Date.now() - 3600000 * 2,
    intent: "Swap 1000 USDC to SOL",
    riskLevel: "safe",
    route: "Jupiter V6",
    networkFee: 0.00001
  },
  {
    id: "dummy-2",
    signature: "2xL...4vN",
    type: "buy",
    status: "pending",
    fromToken: "SOL",
    fromAmount: 2.5,
    toToken: "BONK",
    toAmount: 120000000,
    usdValue: 385,
    timestamp: Date.now() - 300000,
    intent: "Buy BONK with 2.5 SOL",
    riskLevel: "caution",
    route: "Raydium",
    networkFee: 0.00005
  }
];

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
          if (allTxs.length === 0) {
            allTxs.push(...DUMMY_TRANSACTIONS);
          }
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
        } else {
          setTransactions(DUMMY_TRANSACTIONS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_TRANSACTIONS));
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
