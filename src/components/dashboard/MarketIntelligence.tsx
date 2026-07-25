import { Globe2, Activity, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketIntelligence() {
  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <Globe2 className="w-5 h-5 text-primary" />
        Market Intelligence
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Market Sentiment</span>
          <div className="flex items-center gap-2 text-success font-bold font-display text-xl">
            Bullish <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono mt-1 text-muted-foreground">Confidence: 87%</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Volatility Index</span>
          <div className="flex items-center gap-2 text-warning font-bold font-display text-xl">
            Elevated <Activity className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono mt-1 text-muted-foreground">Index: 64.2</span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" /> Whale Activity
          </span>
          <div className="bg-background/50 border border-white/5 rounded-lg p-3 text-sm">
            Increasing SOL accumulation detected in top 100 wallets over the last 48 hours.
          </div>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex items-center gap-1">
            <Globe2 className="w-3 h-3" /> Narrative Trends
          </span>
          <div className="bg-background/50 border border-white/5 rounded-lg p-3 text-sm flex flex-wrap gap-2">
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">AI Agents</span>
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">DePIN</span>
            <span className="bg-white/5 text-muted-foreground px-2 py-0.5 rounded text-xs">LSTs</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/5 pt-4">
        <span className="text-[10px] uppercase tracking-wider text-primary font-semibold block mb-1">Market Agent Commentary</span>
        <p className="text-sm text-foreground/80 italic">
          "Liquidity conditions are tightening across major DEXs. Expect higher slippage for trades &gt;$50k. Stablecoin yields are rising as borrowing demand increases."
        </p>
      </div>
    </div>
  );
}
