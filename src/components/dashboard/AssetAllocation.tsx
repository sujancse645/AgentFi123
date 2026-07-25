import { motion } from "framer-motion";
import { demoPortfolio } from "@/services/demoPortfolio";
import { PieChart, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AssetAllocation() {
  const { assets, totalValueUsd } = demoPortfolio.getPortfolio();

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-primary" />
        Asset Allocation Analyzer
      </h3>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
        {assets.map((asset) => {
          const isOverexposed = asset.allocationPct > 50;
          const isUnderexposed = asset.category === "stable" && asset.allocationPct < 20;

          return (
            <div key={asset.symbol} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-bold text-xs border border-white/10">
                    {asset.symbol.substring(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{asset.name}</h4>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{asset.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold">{asset.allocationPct}%</div>
                  <div className="text-xs text-muted-foreground">${asset.valueUsd.toLocaleString()}</div>
                </div>
              </div>

              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div 
                  className={cn("h-full rounded-full", asset.category === "stable" ? "bg-success" : asset.category === "meme" ? "bg-warning" : "bg-primary")}
                  initial={{ width: 0 }}
                  animate={{ width: `${asset.allocationPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              {/* AI Assessment */}
              <div className={cn(
                "flex items-start gap-2 text-xs p-2 rounded-lg border",
                isOverexposed ? "bg-warning/10 text-warning border-warning/20" :
                isUnderexposed ? "bg-primary/10 text-primary border-primary/20" :
                "bg-success/10 text-success border-success/20"
              )}>
                {isOverexposed || isUnderexposed ? <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                <span>
                  {isOverexposed ? `High concentration risk detected. Contributes 80% to portfolio volatility.` :
                   isUnderexposed ? `Underexposed to stable assets. Target 20% for optimal risk-adjusted returns.` :
                   `Allocation is optimal and within risk parameters.`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
