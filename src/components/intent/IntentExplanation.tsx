import { Brain, Target, Compass, Zap, ShieldCheck, HelpCircle, Wallet, Percent, Coins } from "lucide-react";
import type { ParsedIntent } from "@/lib/intentParser";

export function IntentExplanation({ intent }: { intent: ParsedIntent }) {
  if (!intent) return null;

  const walletBalance = intent.walletContext?.balance ?? 0;
  const percentage = intent.walletContext?.percentage;
  const calculatedAmount = intent.walletContext?.calculatedAmount ?? intent.source.amount;

  return (
    <div className="glass-panel border border-primary/20 rounded-2xl p-6 bg-primary/5">
      <h3 className="font-display font-bold flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary" />
        AI Reasoning & Execution Parameters
      </h3>

      {/* Prominently display Wallet Balance, Percentage, and Calculated Staking Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl border border-border bg-white/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-primary" /> Wallet Balance
          </div>
          <div className="font-mono text-sm font-bold text-foreground mt-1">
            {walletBalance.toFixed(4)} SOL
          </div>
        </div>

        {percentage !== undefined ? (
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
            <div className="text-[10px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" /> Percentage Selected
            </div>
            <div className="font-mono text-sm font-bold text-primary mt-1">
              {percentage}%
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-muted-foreground" /> Detected Action
            </div>
            <div className="font-mono text-sm font-bold text-foreground capitalize mt-1">
              {intent.action}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border bg-white/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-teal" /> Calculated Amount
          </div>
          <div className="font-mono text-sm font-bold text-teal mt-1">
            {calculatedAmount.toFixed(4)} {intent.source.token}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
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
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1"><Target className="w-3 h-3"/> Action Type</span>
          <span className="font-medium text-foreground capitalize mt-1 block">{intent.action}</span>
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
