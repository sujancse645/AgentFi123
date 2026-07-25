import { formatPercentage } from "@/utils/agentMetrics";
import { useEffect, useState } from "react";
import { simulationService, SimulationResult } from "@/services/simulationService";
import { ServerCog, ArrowRight, ShieldAlert, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function SimulationPanel({ quoteResponse, sourceToken, targetToken }: { quoteResponse: any, sourceToken: string, targetToken: string }) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const runSim = async () => {
      setLoading(true);
      try {
        const res = await simulationService.simulateTransaction(quoteResponse);
        if (active) setResult(res);
      } catch (e) {
        console.error("Simulation failed", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    runSim();
    return () => { active = false; };
  }, [quoteResponse]);

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center h-40 animate-pulse">
        <div className="flex flex-col items-center text-muted-foreground">
          <ServerCog className="w-6 h-6 animate-spin mb-2" />
          <span className="text-sm font-semibold uppercase tracking-wider">Simulating Transaction...</span>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h4 className="font-display font-bold flex items-center gap-2 mb-4 text-foreground/90">
        <ServerCog className="w-4 h-4 text-primary" />
        Simulation Results
      </h4>

      <div className="flex items-center justify-between mb-6 bg-background/50 rounded-lg p-3 border border-white/5">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Input</span>
          <span className="font-bold text-lg">{sourceToken}</span>
        </div>
        <div className="text-muted-foreground flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider mb-1">Route</span>
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Expected Output</span>
          <span className="font-bold text-lg text-success">{targetToken}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Est. Slippage</span>
          <div className="font-mono mt-1 flex items-center gap-1">
            {result.estimatedSlippage}%
            {result.estimatedSlippage > 1 && <ShieldAlert className="w-3 h-3 text-warning" />}
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Priority Fee</span>
          <div className="font-mono mt-1 text-muted-foreground">
            {result.priorityFee} SOL
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Route Quality</span>
          <div className={cn("mt-1 font-medium", result.routeQuality === "High" ? "text-success" : "text-warning")}>
            {result.routeQuality}
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Confidence</span>
          <div className="font-mono mt-1 text-primary flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {formatPercentage(result.executionConfidence)}
          </div>
        </div>
      </div>

    </div>
  );
}
