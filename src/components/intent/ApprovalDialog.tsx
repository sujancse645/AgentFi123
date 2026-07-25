import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import type { ParsedIntent } from "@/lib/intentParser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { executionService } from "@/services/executionService";
import { SimulationPanel } from "./SimulationPanel";
import { IntentExplanation } from "./IntentExplanation";
import { useAgentStore } from "@/store/useAgentStore";
import { confirmExecutionInDemo } from "@/services/demoAgentEngine";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSign: (signature?: string) => void;
  intent: ParsedIntent | null;
}

const truncate = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

export const ApprovalDialog = ({ open, onOpenChange, onSign, intent }: Props) => {
  const { publicKey, wallet, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectionStatus = useAgentStore(s => s.connectionStatus);
  const executionAgent = useAgentStore(s => s.agents.execution);
  const riskAgent = useAgentStore(s => s.agents.risk);

  const isDemo = connectionStatus === "demo";

  const isSimulationIncomplete = executionAgent.status !== "waiting";
  const isRiskBlocked = riskAgent.status === "failed";
  const isBackendPending = connectionStatus === "connecting";

  const handleSign = async () => {
    if (!publicKey || !connection) {
      setError("Wallet not connected");
      return;
    }

    if (!intent?.quoteResponse && !isDemo) {
      setError("No valid Jupiter quote found for this intent.");
      return;
    }

    setSigning(true);
    setError(null);

    try {
      if (isDemo) {
        // Fallback for demo execution
        await confirmExecutionInDemo();
        setSigning(false);
        onSign("demo-signature-success");
        return;
      }

      // 1. Fetch real serialized transaction from Jupiter v6
      const transaction = await executionService.getSwapTransaction(
        intent.quoteResponse!,
        publicKey.toBase58()
      );

      // 2. Execute via the user's wallet
      const signature = await executionService.executeTransaction(
        transaction,
        connection,
        sendTransaction
      );

      setSigning(false);
      onSign(signature);
    } catch (err) {
      console.error("Transaction execution failed:", err);
      // Map technical errors to readable UI messages
      setError("The execution route could not be confirmed. Please check your wallet connection and try again.");
      setSigning(false);
    }
  };

  if (!intent) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !signing && onOpenChange(v)}>
      <DialogContent className="glass-card sm:max-w-2xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Execution Approval
          </DialogTitle>
          <DialogDescription>
            Review the agent's recommended execution path and authorize the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">
          
          <IntentExplanation intent={intent} />
          
          {intent.quoteResponse ? (
            <SimulationPanel 
              quoteResponse={intent.quoteResponse} 
              sourceToken={intent.source.token} 
              targetToken={intent.target.token} 
            />
          ) : isDemo ? (
            <div className="rounded-lg border border-warning/50 bg-warning/10 p-4 text-sm text-warning">
              Running in demo mode. A mocked simulation route is active.
            </div>
          ) : null}

          {publicKey && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-white/5 px-4 py-3 text-sm">
              <span className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Signing Wallet</span>
              <span className="flex items-center gap-2 font-mono text-primary font-bold">
                {wallet?.adapter.icon && (
                  <img src={wallet.adapter.icon} alt="" className="h-4 w-4 rounded-sm" />
                )}
                {truncate(publicKey.toBase58())}
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3 justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={signing}>
            Reject
          </Button>
          <Button
            className="gap-2 bg-gradient-primary text-white hover:opacity-90 min-w-[140px]"
            onClick={handleSign}
            disabled={signing || isSimulationIncomplete || isRiskBlocked || isBackendPending || !publicKey}
          >
            {signing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Executing
              </>
            ) : (
              "Sign & Execute"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
