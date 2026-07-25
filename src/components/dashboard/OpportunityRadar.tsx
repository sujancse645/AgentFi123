import { motion } from "framer-motion";
import { Radar, Target, AlertTriangle } from "lucide-react";

export function OpportunityRadar() {
  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/40 transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Radar className="w-24 h-24 text-primary animate-[spin_4s_linear_infinite]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="font-display font-bold">Opportunity Radar</h3>
        </div>

        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Detected Opportunity</span>
          <h4 className="text-lg font-bold text-primary mt-1">High Yield Staking</h4>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs mb-1">Protocol</span>
            <span className="font-medium flex items-center gap-1"><Target className="w-3 h-3 text-success" /> Kamino</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs mb-1">Expected APY</span>
            <span className="font-mono font-bold text-success">8.4%</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs mb-1">Confidence</span>
            <span className="font-mono">88%</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs mb-1">Risk Level</span>
            <span className="font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-warning" /> Medium</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-white/5 border border-white/5 rounded-lg p-3">
          <strong className="text-foreground/80">Status:</strong> Monitored continuously by Market Agent. Rebalancing recommended.
        </div>
      </div>
    </div>
  );
}
