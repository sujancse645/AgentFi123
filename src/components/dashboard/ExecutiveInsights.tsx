import { ShieldAlert, TrendingUp, Compass, Zap } from "lucide-react";

export function ExecutiveInsights() {
  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <Compass className="w-5 h-5 text-primary" />
        Executive Insights
      </h3>

      <div className="flex-1 space-y-4">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-primary font-bold block mb-1 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Most Important Action
          </span>
          <h4 className="font-bold text-sm">Convert 10% SOL to USDC</h4>
          <p className="text-xs text-muted-foreground mt-1">Rebalance required to hit target risk parameters.</p>
        </div>

        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-destructive font-bold block mb-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Biggest Risk
          </span>
          <h4 className="font-bold text-sm">Concentration Exposure</h4>
          <p className="text-xs text-muted-foreground mt-1">Single asset (SOL) accounts for &gt;70% of portfolio volatility.</p>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-success font-bold block mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Best Opportunity
          </span>
          <h4 className="font-bold text-sm">Kamino USDC Staking</h4>
          <p className="text-xs text-muted-foreground mt-1">Stablecoin yields elevated to 8.4% APY.</p>
        </div>
      </div>
    </div>
  );
}
