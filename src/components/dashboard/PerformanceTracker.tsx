import { LineChart, TrendingUp, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function PerformanceTracker() {
  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <LineChart className="w-5 h-5 text-primary" />
        Performance Tracker
      </h3>

      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Portfolio Growth (30d)</span>
            <div className="text-2xl font-display font-bold text-success flex items-center gap-1 mt-1">
              +14.2% <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">AI Value Generated</span>
            <div className="text-2xl font-display font-bold text-primary flex items-center gap-1 mt-1">
              +$420 <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-muted-foreground block mt-1">Via optimized routing & yields</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-muted-foreground">Execution Success Rate</span>
              <span className="font-bold">99.2%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-success w-[99.2%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-muted-foreground">Recommendations Followed</span>
              <span className="font-bold flex items-center gap-1"><Target className="w-3 h-3 text-primary" /> 8 / 10</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[80%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
