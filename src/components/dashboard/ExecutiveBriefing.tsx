import { formatPercentage } from "@/utils/agentMetrics";
import { Sparkles, Activity, ShieldAlert, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { demoPortfolio } from "@/services/demoPortfolio";
import { riskEngine } from "@/services/riskEngine";
import { recommendationEngine } from "@/services/recommendationEngine";

export function ExecutiveBriefing() {
  const pf = demoPortfolio.getPortfolio();
  const risk = riskEngine.analyzeRisk(pf);
  const recs = recommendationEngine.generateRecommendations(pf);
  const topRec = recs[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="glass-panel border border-primary/30 rounded-3xl p-8 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden shadow-[0_0_40px_rgba(124,92,252,0.15)]">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Sparkles className="w-48 h-48 text-primary animate-pulse" />
      </div>

      <div className="relative z-10">
        <h2 className="font-display text-2xl font-bold mb-6">
          {getGreeting()}, <span className="text-primary">{pf.persona}</span>.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="border-l-2 border-primary pl-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Portfolio Health</span>
            <div className="text-3xl font-display font-bold mt-1">84<span className="text-lg text-muted-foreground">/100</span></div>
          </div>
          <div className="border-l-2 border-warning pl-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Risk Level</span>
            <div className="text-2xl font-display font-bold text-warning mt-1">{risk.riskLevel}</div>
          </div>
          <div className="border-l-2 border-success pl-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Market Outlook</span>
            <div className="text-2xl font-display font-bold text-success flex items-center gap-2 mt-1">
              Bullish <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Value</span>
            <div className="text-2xl font-display font-bold mt-1">${pf.totalValueUsd.toLocaleString()}</div>
          </div>
        </div>

        {topRec && (
          <div className="bg-background/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                  Top Opportunity
                </span>
                <span className="text-xs font-mono text-primary flex items-center gap-1">
                  <Activity className="w-3 h-3" /> {formatPercentage(topRec.confidence)} Confidence
                </span>
              </div>
              <h4 className="text-xl font-bold mb-1">{topRec.title}</h4>
              <p className="text-sm text-muted-foreground max-w-xl">{topRec.reasoning}</p>
            </div>
            
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-sm font-semibold text-success flex items-center gap-1">
                Expected Benefit: {topRec.expectedImpact}
              </span>
              <button 
                onClick={() => {
                  toast.success("Execution Started", {
                    description: `Executing: ${topRec.title}`,
                  });
                  setTimeout(() => {
                    toast.success("Execution Completed", {
                      description: `Successfully executed: ${topRec.title}`,
                    });
                  }, 2000);
                }}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all"
              >
                Execute Instantly
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
