import { Store, ShieldCheck, TrendingUp, Zap, Target } from "lucide-react";

export function StrategyMarketplace() {
  const strategies = [
    { title: "Yield Maximizer", category: "High Yield", return: "12.4%", risk: "Medium", conf: 88, reason: "Current market conditions favor staking and lending protocols." },
    { title: "Conservative Income", category: "Stable", return: "5.2%", risk: "Low", conf: 95, reason: "Allocates primarily to over-collateralized stablecoin pools." },
    { title: "Whale Strategy", category: "Balanced", return: "8.1%", risk: "Medium", conf: 91, reason: "Optimized for large capital deployment with minimal slippage." },
  ];

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <Store className="w-5 h-5 text-primary" />
        Strategy Marketplace
      </h3>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
        {strategies.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/40 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold mb-2 inline-block">
                  {s.category}
                </span>
                <h4 className="font-bold">{s.title}</h4>
              </div>
              <div className="text-right">
                <span className="text-xl font-display font-bold text-success block leading-none">{s.return}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Expected APY</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4 bg-background/50 p-3 rounded-lg border border-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Risk Level</span>
                <span className="font-medium flex items-center gap-1 mt-0.5 text-warning"><ShieldAlert className="w-3 h-3" /> {s.risk}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Confidence</span>
                <span className="font-medium flex items-center gap-1 mt-0.5 text-primary font-mono"><Zap className="w-3 h-3" /> {s.conf}%</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{s.reason}</p>

            <div className="flex gap-2">
              <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-xs font-semibold transition-colors">
                Simulate
              </button>
              <button className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg py-2 text-xs font-semibold shadow-lg shadow-primary/20 transition-all">
                Execute
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { ShieldAlert } from "lucide-react";
