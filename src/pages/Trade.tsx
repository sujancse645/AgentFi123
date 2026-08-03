import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ParsedIntentCard } from "@/components/intent/ParsedIntentCard";
import { RiskCard } from "@/components/intent/RiskCard";
import { SimulationCard } from "@/components/intent/SimulationCard";
import { ApprovalDialog } from "@/components/intent/ApprovalDialog";
import { StatusOverlay } from "@/components/intent/StatusOverlay";
import { DemoSuccessModal } from "@/components/demo/DemoSuccessModal";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ShieldCheck, Wallet, ArrowLeft, Check } from "lucide-react";
import { useSolBalance } from "@/hooks/useSolBalance";
import { useTransactions } from "@/hooks/useTransactions";
import { parseIntent, type ParsedIntent } from "@/lib/intentParser";
import { Link } from "react-router-dom";
import { useAgentStore } from "@/store/useAgentStore";
import { simulateIntentInDemo } from "@/services/demoAgentEngine";

const PLACEHOLDER =
  "Swap 1 SOL for the best performing meme token right now, but skip anything that looks like a rug";

const EXAMPLE_INTENTS = [
  "Buy $50 of SOL every Friday",
  "Sell my BONK if it pumps 30%",
  "DCA into JUP over 7 days",
  "Limit order: Buy SOL at $150",
  "Rebalance my portfolio to 50% SOL, 30% JUP, 20% USDC",
];

export default function Trade() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { balance } = useSolBalance();
  const { addTransaction } = useTransactions();
  const [intent, setIntent] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<ParsedIntent | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [demoSuccessOpen, setDemoSuccessOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const isDemo = useAgentStore(s => s.connectionStatus) === "demo";

  const handleParse = async () => {
    if (parsing) return;
    if (!connected && !isDemo) {
      setVisible(true);
      return;
    }
    setParsed(null);
    setParsing(true);
    const text = intent;
    
    try {
      if (isDemo) {
        // Trigger the visual demo flow across the dashboard
        simulateIntentInDemo("demo-intent", text);
      }
      
      const result = await parseIntent(text, {
        walletBalance: balance ?? 0,
        preferredSlippage: 0.5,
        riskTolerance: "medium",
      });
      setParsed(result);
    } catch (error) {
      console.error("Failed to parse intent:", error);
    } finally {
      setParsing(false);
    }
  };

  const handleSign = (signature?: string) => {
    setReviewOpen(false);
    if (signature) {
      setTxSignature(signature);
    }
    if (signature === "demo-signature-success") {
      setDemoSuccessOpen(true);
    } else {
      setStatusOpen(true);
    }
  };

  const handleStatusClose = () => {
    setStatusOpen(false);
    setShowSuccess(true);
    
    if (parsed && txSignature) {
      addTransaction({
        signature: txSignature,
        type: parsed.action,
        status: "confirmed",
        fromToken: parsed.source.token,
        fromAmount: parsed.source.amount,
        toToken: parsed.target.token,
        toAmount: parsed.simulation.outAmount,
        usdValue: parsed.simulation.inUsd,
        timestamp: Date.now(),
        intent: intent,
        riskLevel: parsed.risk.level,
        route: parsed.simulation.route,
        networkFee: parsed.simulation.networkFeeSol,
      });
    }
  };

  const reset = () => {
    setIntent("");
    setParsed(null);
    setShowSuccess(false);
    setTxSignature(null);
    useAgentStore.getState().resetAgents();
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold">AI Trading</h1>
            <p className="text-muted-foreground">
              Describe your trade in plain English
            </p>
          </div>
        </div>
        {connected && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Wallet ready · Balance{" "}
            <span className="font-mono text-foreground">
              {balance !== null ? balance.toFixed(4) : "—"} SOL
            </span>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Success State */}
        {showSuccess ? (
          <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal/15">
              <Check className="h-8 w-8 text-teal" />
            </div>
            <h2 className="font-display text-xl font-semibold">Transaction Complete!</h2>
            <p className="mt-2 text-muted-foreground">
              Your intent has been executed successfully on Solana.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/transactions">
                <Button variant="outline">View History</Button>
              </Link>
              <Button onClick={reset} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                New Trade
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Intent Input */}
            <div className="glass-card rounded-2xl p-3 transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]">
              <Textarea
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder={PLACEHOLDER}
                className="min-h-[140px] resize-none border-0 bg-transparent text-base leading-relaxed shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 md:text-lg"
              />
              <div className="flex flex-col items-stretch gap-2 border-t border-border/60 px-1 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal" />
                  Nothing is signed without your approval
                </div>
                <Button
                  size="lg"
                  onClick={handleParse}
                  disabled={parsing || !intent.trim()}
                  className="gap-2 bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary disabled:opacity-70"
                >
                  {parsing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing with Grok AI…</>
                  ) : (!connected && !isDemo) ? (
                    <><Wallet className="h-4 w-4" /> Connect to Parse</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Parse My Intent</>
                  )}
                </Button>
              </div>
            </div>

            {/* Example Chips */}
            {!parsed && !parsing && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-muted-foreground">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_INTENTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setIntent(s)}
                      className="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Analyzing State */}
            {parsing && (
              <div className="mt-8 animate-fade-in">
                <div className="glass-card flex items-center gap-3 rounded-xl px-4 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Analyzing your intent with AI…</div>
                    <div className="text-xs text-muted-foreground">
                      Fetching real-time prices · analyzing market data · checking wallet balance
                    </div>
                  </div>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
                </div>
              </div>
            )}

            {/* Result Cards */}
            {parsed && !parsing && (
              <div className="mt-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <ParsedIntentCard intent={parsed} />
                  <RiskCard intent={parsed} />
                  <SimulationCard intent={parsed} />
                </div>

                <div className="flex flex-col items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => setReviewOpen(true)}
                    className="h-14 w-full max-w-md gap-2 bg-gradient-primary text-base font-semibold text-primary-foreground hover:opacity-90 glow-primary animate-pulse-glow"
                  >
                    Review & Approve
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll see a final summary before signing.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ApprovalDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onSign={handleSign}
        intent={parsed}
      />
      <StatusOverlay open={statusOpen} onClose={handleStatusClose} signature={txSignature} />
      <DemoSuccessModal 
        open={demoSuccessOpen} 
        onOpenChange={(open) => {
          setDemoSuccessOpen(open);
          if (!open) handleStatusClose();
        }} 
      />
    </div>
  );
}
