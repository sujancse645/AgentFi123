import { formatPercentage } from "@/utils/agentMetrics";
import { Recommendation } from "@/services/recommendationEngine";
import { HelpCircle, Eye, Activity, CheckCircle2, Zap } from "lucide-react";

export function WhyThisRecommendation({ rec }: { rec: Recommendation }) {
  if (!rec) return null;

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 bg-gradient-to-br from-white/5 to-transparent">
      <h4 className="font-display font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-primary" />
        AI Explainability Layer
      </h4>

      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">Observed Data</span>
            <p className="text-sm font-medium">{rec.observedData}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-warning" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">Analysis</span>
            <p className="text-sm font-medium">{rec.analysis}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold block mb-1">Conclusion / Recommendation</span>
            <p className="text-sm font-bold text-primary">{rec.actionText}</p>
          </div>
        </div>

        <div className="bg-background/50 rounded-xl p-4 border border-white/5 grid grid-cols-2 gap-4">
          <div>
             <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">Expected Outcome</span>
             <span className="text-sm text-success font-medium">{rec.expectedOutcome}</span>
          </div>
          <div>
             <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">Confidence</span>
             <span className="font-mono font-bold text-primary flex items-center gap-1">
               <Zap className="w-3 h-3" /> {formatPercentage(rec.confidence)}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
