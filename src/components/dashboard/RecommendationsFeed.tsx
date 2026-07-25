import { formatPercentage } from "@/utils/agentMetrics";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recommendationEngine, Recommendation } from "@/services/recommendationEngine";
import { Sparkles, ArrowRight, ShieldAlert, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecommendationsFeed() {
  const [recs, setRecs] = useState<Recommendation[]>([]);

  useEffect(() => {
    // In a real app, this might be event-driven. Here we just fetch initially.
    setRecs(recommendationEngine.generateRecommendations());
  }, []);

  if (recs.length === 0) return null;

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-display font-bold">AI Recommendations</h3>
      </div>

      <div className="space-y-4">
        {recs.map((rec) => (
          <motion.div 
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-colors group"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-primary font-semibold block mb-1">
                  {rec.type}
                </span>
                <h4 className="font-bold text-lg">{rec.title}</h4>
              </div>
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
                <Zap className="w-3 h-3" />
                {formatPercentage(rec.confidence)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Expected Impact</span>
                <div className="font-mono text-sm text-success font-medium flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {rec.expectedImpact}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Risk Level</span>
                <div className={cn(
                  "font-medium text-sm flex items-center gap-1 mt-0.5",
                  rec.riskLevel === "Low" ? "text-success" : rec.riskLevel === "Medium" ? "text-warning" : "text-destructive"
                )}>
                  {rec.riskLevel !== "Low" && <ShieldAlert className="w-3 h-3" />}
                  {rec.riskLevel}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {rec.reasoning}
            </p>

            <button className="w-full flex items-center justify-between bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              {rec.actionText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
