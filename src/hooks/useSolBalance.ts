import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function useSolBalance(pollMs = 15000) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    let subId: number | null = null;

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const lamports = await connection.getBalance(publicKey, "confirmed");
        if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL);
      } catch {
        if (!cancelled) setBalance(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, pollMs);

    // Live subscription for real-time updates
    try {
      subId = connection.onAccountChange(
        publicKey,
        (acc) => {
          if (!cancelled) setBalance(acc.lamports / LAMPORTS_PER_SOL);
        },
        "confirmed",
      );
    } catch {
      /* ignore */
    }

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (subId !== null) {
        connection.removeAccountChangeListener(subId).catch(() => {});
      }
    };
  }, [connection, publicKey, pollMs]);

  return { balance, loading };
}
