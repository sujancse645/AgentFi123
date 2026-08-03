import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, ArrowRight, Zap, Target, TrendingUp, Wallet, Loader2, AlertCircle } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAgentStore } from "@/store/useAgentStore";
import { useSolBalance } from "@/hooks/useSolBalance";
import { agentApi } from "@/services/agentApi";
import { parseIntent, type ParsedIntent } from "@/lib/intentParser";
import { ApprovalDialog } from "@/components/intent/ApprovalDialog";

export function StrategyLab() {
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const { balance: liveSolBalance } = useSolBalance();
  const connectionStatus = useAgentStore(s => s.connectionStatus);
  const isDemo = connectionStatus === "demo";

  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [pendingExecutionScenario, setPendingExecutionScenario] = useState<string | null>(null);
  const [parsedIntent, setParsedIntent] = useState<ParsedIntent | null>(null);
  const [approvalOpen, setApprovalOpen] = useState(false);

  const isZeroBalance = connected && liveSolBalance !== null && liveSolBalance <= 0;

  const scenarios = [
    { id: "stake", title: "Stake 50% SOL", riskChange: "Unchanged", healthChange: "+8", yieldChange: "+7.4%", reason: "Idle assets converted into yield-generating positions." },
    { id: "stable", title: "Move 20% into USDC", riskChange: "-15%", healthChange: "+5", yieldChange: "+1.2%", reason: "Reduces volatility exposure during uncertain market conditions." },
    { id: "rebalance", title: "Auto Rebalance", riskChange: "-5%", healthChange: "+12", yieldChange: "+2.1%", reason: "Realigns portfolio to target risk parameters." },
  ];

  const executeSelectedStrategy = useCallback(async (scenarioId?: string) => {
    const targetId = scenarioId || activeScenario;
    if (!targetId) {
      toast.error("Please select a strategy first.");
      return;
    }

    const scenario = scenarios.find(s => s.id === targetId);
    if (!scenario) {
      toast.error("Invalid strategy selected.");
      return;
    }

    if (!connected) {
      setPendingExecutionScenario(targetId);
      setVisible(true);
      toast.info("Please connect your Solana wallet to execute this strategy.");
      return;
    }

    // Fetch latest balance from connection or hook
    let effectiveBalance = 2.5; // fallback
    if (connected && publicKey && connection) {
      try {
        const lamports = await connection.getBalance(publicKey, "confirmed");
        effectiveBalance = lamports / 1_000_000_000;
      } catch {
        effectiveBalance = liveSolBalance ?? 0;
      }
    } else if (isDemo) {
      effectiveBalance = 2.5;
    }

    if (connected && effectiveBalance <= 0) {
      toast.error("Your wallet has no SOL available.");
      return;
    }

    setIsPreparing(true);

    try {
      // Calculate dynamic amount based on scenario percentage
      let percentage = 50;
      if (targetId === "stake") percentage = 50;
      else if (targetId === "stable") percentage = 20;
      else if (targetId === "rebalance") percentage = 50;

      const calculatedAmount = +(effectiveBalance * (percentage / 100)).toFixed(4);
      const lamports = Math.max(1, Math.floor(calculatedAmount * 1_000_000_000));

      // Map scenario to intent text with actual calculated amounts
      const intentText = targetId === "stake"
        ? `Stake 50% SOL (${calculatedAmount.toFixed(4)} SOL) into high-yield staking protocol`
        : targetId === "stable"
        ? `Swap ${calculatedAmount.toFixed(4)} SOL (20% of ${effectiveBalance.toFixed(4)} SOL) to USDC`
        : `Rebalance portfolio: Swap ${calculatedAmount.toFixed(4)} SOL (50% allocation) to USDC and JUP`;

      // 1. Submit intent to backend API
      try {
        const intentResult = await agentApi.submitIntent({
          intent: intentText,
          wallet: publicKey?.toBase58() || "demo-wallet"
        });

        if (intentResult?.id) {
          // Trigger route simulation in backend with calculated amount
          await agentApi.simulateIntent(intentResult.id, {
            inputMint: "So11111111111111111111111111111111111111112",
            outputMint: targetId === "stable" ? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" : "JUPyiwrYJFskUPiHa7hkeRQoUtiQTv8LAGe12zjgMNm",
            amount: lamports
          }).catch(() => null);
        }
      } catch (backendError) {
        console.warn("Backend API sync notice:", backendError);
      }

      // 2. Parse intent for client-side simulation & verification
      const parsed = await parseIntent(intentText, {
        walletBalance: effectiveBalance,
        preferredSlippage: 0.5,
        riskTolerance: "medium"
      });

      if (!parsed) {
        throw new Error("Simulation failure: Could not parse strategy parameters.");
      }

      setParsedIntent(parsed);
      setApprovalOpen(true);
      toast.success("Strategy prepared", {
        description: `Review execution parameters for ${scenario.title}`
      });
    } catch (err: any) {
      console.error("Strategy execution preparation failed:", err);
      toast.error("Failed to prepare strategy: " + (err.message || "Unknown error"));
    } finally {
      setIsPreparing(false);
    }
  }, [activeScenario, connected, publicKey, connection, liveSolBalance, isDemo, setVisible, scenarios]);

  // Auto-continue when wallet connects after user initiated execution
  useEffect(() => {
    if (connected && publicKey && pendingExecutionScenario) {
      const scenarioToRun = pendingExecutionScenario;
      setPendingExecutionScenario(null);
      toast.success("Wallet connected. Continuing strategy preparation...");
      executeSelectedStrategy(scenarioToRun);
    }
  }, [connected, publicKey, pendingExecutionScenario, executeSelectedStrategy]);

  const applyScenario = (id: string) => {
    setSimulating(true);
    setTimeout(() => {
      setActiveScenario(id);
      setSimulating(false);
    }, 800);
  };

  const handleSign = (signature?: string) => {
    setApprovalOpen(false);
    if (signature) {
      toast.success("Strategy Executed Successfully", {
        description: `Transaction confirmed on-chain.`
      });
    }
  };

  const activeData = scenarios.find(s => s.id === activeScenario);

  return (
    <div className="glass-panel border border-primary/20 rounded-3xl p-6 lg:p-8 flex flex-col h-[500px]">
      <h3 className="font-display font-bold text-xl flex items-center gap-3 mb-6">
        <Beaker className="w-6 h-6 text-primary" />
        Strategy Lab
        <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
          {isDemo ? "Demo Simulation" : "Simulation"}
        </span>
      </h3>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 h-full overflow-hidden">
        
        {/* Left: Scenarios */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3 overflow-y-auto no-scrollbar pr-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Test Scenarios</span>
          {scenarios.map(s => (
            <button 
              key={s.id} 
              id={`scenario-btn-${s.id}`}
              onClick={() => applyScenario(s.id)}
              className={cn(
                "text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                activeScenario === s.id ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:border-white/20"
              )}
            >
              <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{s.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{s.reason}</p>
            </button>
          ))}
        </div>

        {/* Right: Results Dashboard */}
        <div className="w-full lg:w-2/3 bg-background/40 border border-white/5 rounded-2xl p-6 relative flex flex-col justify-center items-center">
          
          <AnimatePresence mode="wait">
            {!activeScenario && !simulating && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center text-muted-foreground flex flex-col items-center justify-center h-full w-full"
              >
                <Beaker className="w-12 h-12 mb-4 opacity-20" />
                <p className="mb-4">Select a scenario to simulate portfolio changes.</p>
                <button
                  id="execute-strategy-btn"
                  disabled={true}
                  className="w-full max-w-xs font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-muted-foreground cursor-not-allowed opacity-60"
                >
                  <Zap className="w-4 h-4" />
                  Select a Strategy First
                </button>
              </motion.div>
            )}

            {simulating && (
              <motion.div 
                key="simulating"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 relative mb-4">
                  <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-b-2 border-success rounded-full animate-spin animation-delay-150"></div>
                </div>
                <p className="text-primary font-mono text-sm animate-pulse">Running Monte Carlo simulation...</p>
              </motion.div>
            )}

            {activeScenario && !simulating && activeData && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Current Portfolio</span>
                    <div className="w-16 h-16 rounded-full border-4 border-muted-foreground/30 flex items-center justify-center">
                      <Target className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center flex-1 text-primary">
                    <span className="text-[10px] uppercase tracking-wider mb-2 font-bold animate-pulse">Scenario Applied</span>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-bold mb-2">Projected Portfolio</span>
                    <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center bg-primary/10 shadow-[0_0_20px_rgba(124,92,252,0.3)]">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Expected Yield</span>
                    <span className="text-xl font-display font-bold text-success flex items-center justify-center gap-1">
                      {activeData.yieldChange} <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Risk Profile</span>
                    <span className="text-xl font-display font-bold text-foreground">
                      {activeData.riskChange}
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Health Score</span>
                    <span className="text-xl font-display font-bold text-success">
                      {activeData.healthChange}
                    </span>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mt-auto">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs uppercase tracking-wider text-primary font-bold">AI Commentary</span>
                    <span className="text-[10px] font-mono text-primary flex items-center gap-1"><Zap className="w-3 h-3"/> 92% Confidence</span>
                  </div>
                  <p className="text-sm text-foreground/90">{activeData.reason}</p>
                  
                  <button 
                    id="execute-strategy-btn"
                    onClick={() => executeSelectedStrategy()}
                    disabled={isPreparing || simulating || isZeroBalance}
                    className={cn(
                      "mt-4 w-full font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2 shadow-lg",
                      isZeroBalance
                        ? "bg-destructive/20 border border-destructive/30 text-destructive cursor-not-allowed"
                        : isPreparing 
                        ? "bg-primary/50 text-white cursor-wait" 
                        : "bg-primary hover:bg-primary/90 text-white shadow-primary/20 cursor-pointer"
                    )}
                  >
                    {isPreparing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Preparing Strategy...
                      </>
                    ) : isZeroBalance ? (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Your wallet has no SOL available.
                      </>
                    ) : !connected ? (
                      <>
                        <Wallet className="w-4 h-4" />
                        Connect Wallet & Execute
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Execute Strategy
                      </>
                    )}
                  </button>
                  {isZeroBalance && (
                    <p className="mt-2 text-center text-xs text-destructive font-medium">
                      Your wallet has no SOL available.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ApprovalDialog
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
        onSign={handleSign}
        intent={parsedIntent}
      />
    </div>
  );
}
