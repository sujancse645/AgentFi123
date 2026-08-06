import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { ActionKind } from "@/lib/intentParser";
import { agentApi } from "@/services/agentApi";

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

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        // Note: You would normally determine demoSessionId / mode from a global context.
        // For now, we will fetch live transactions for the connected wallet.
        const params: any = {};
        if (publicKey) {
          params.wallet = publicKey.toBase58();
          params.mode = "live";
        }
        
        // If not connected, we could fetch demo transactions or just return empty.
        // We'll fetch everything if no wallet, but in reality we'd restrict it.
        const txs = await agentApi.getTransactions<Transaction[]>(params);
        setTransactions(txs || []);
      } catch (error) {
        console.error("Failed to load transactions", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [publicKey]);

  // Add a new transaction (Optimistic UI update)
  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    const newTx: Transaction = {
      ...tx,
      id: `${publicKey?.toBase58() || "anon"}:${Date.now()}:${Math.random().toString(36).slice(2)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, [publicKey]);

  // Update transaction status (Optimistic UI update)
  const updateTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
      );
    },
    []
  );

  // Clear all transactions locally
  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

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
