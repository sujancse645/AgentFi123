import { Target, TrendingUp, ShieldAlert, CheckCircle2 } from "lucide-react";
import { recommendationEngine } from "@/services/recommendationEngine";
import { cn } from "@/lib/utils";

export function RecommendationCenter() {
  const recs = recommendationEngine.generateRecommendations();

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-primary" />
        Advanced Recommendation Center
      </h3>

      <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2">
        {recs.map((rec, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              {rec.type === "Yield Optimization" ? <TrendingUp className="w-16 h-16" /> : 
               rec.type === "Risk Management" ? <ShieldAlert className="w-16 h-16" /> : 
               <Target className="w-16 h-16" />}
            </div>

            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-wider text-primary font-bold block mb-1">
                {rec.type}
              </span>
              <h4 className="font-bold text-lg mb-2">{rec.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{rec.reasoning}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Expected Benefit</span>
                  <span className="font-mono text-sm text-success font-bold">{rec.expectedImpact}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Risk</span>
                  <span className={cn(
                    "text-sm font-bold",
                    rec.riskLevel === "Low" ? "text-success" : rec.riskLevel === "Medium" ? "text-warning" : "text-destructive"
                  )}>
                    {rec.riskLevel}
                  </span>
                </div>
              </div>

              <button className="flex items-center justify-center w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg py-2 text-xs font-semibold transition-colors gap-2">
                <CheckCircle2 className="w-4 h-4" /> 1-Click Execution
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
