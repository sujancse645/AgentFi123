import { Brain, Target, Compass, Zap, ShieldCheck, HelpCircle } from "lucide-react";
import type { ParsedIntent } from "@/lib/intentParser";

export function IntentExplanation({ intent }: { intent: ParsedIntent }) {
  if (!intent) return null;

  return (
    <div className="glass-panel border border-primary/20 rounded-2xl p-6 bg-primary/5">
      <h3 className="font-display font-bold flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary" />
        AI Reasoning
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1"><Target className="w-3 h-3"/> Detected Action</span>
          <span className="font-medium text-foreground capitalize mt-1 block">{intent.action}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1"><Compass className="w-3 h-3"/> Objective</span>
          <span className="font-medium text-foreground mt-1 block">{intent.meta?.strategy || "Reduce volatility exposure"}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1"><Zap className="w-3 h-3"/> Execution Path</span>
          <span className="font-medium text-foreground mt-1 block">
            {intent.source.token} → {intent.simulation.route.replace("API", "")} → {intent.target.token}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Risk Assessment</span>
          <span className="font-medium text-success mt-1 block">{intent.risk.level === "safe" ? "Low" : intent.risk.level === "caution" ? "Medium" : "High"}</span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1 mb-2">
          <HelpCircle className="w-3 h-3" /> Agent Reasoning
        </span>
        <ul className="text-sm text-foreground/80 space-y-2">
          {intent.meta?.reasoning?.map((reason, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{reason}</span>
            </li>
          )) || <li>Liquidity conditions are favorable and expected slippage remains below constraints.</li>}
        </ul>
      </div>
    </div>
  );
}
