import { formatPercentage } from "@/utils/agentMetrics";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { financialHealthEngine, FinancialHealth as HealthData } from "@/services/financialHealthEngine";
import { useWallet } from "@solana/wallet-adapter-react";
import { Activity, ShieldAlert, PieChart, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ScoreBar = ({ label, score, icon: Icon }: { label: string, score: number, icon: any }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <span className="text-sm font-mono font-medium">{score}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        className={cn("h-full rounded-full", score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive")}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  </div>
);

export function FinancialHealth() {
  const { publicKey } = useWallet();
  const [data, setData] = useState<HealthData | null>(null);

  useEffect(() => {
    // Re-evaluate when wallet changes
    const result = financialHealthEngine.analyzeWallet(publicKey?.toBase58() || null);
    setData(result);
  }, [publicKey]);

  if (!data) return null;

  return (
    <div className="glass-panel border border-border/40 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
      {/* Left: Overall Score Gauge */}
      <div className="flex flex-col items-center justify-center lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
        <h3 className="font-display font-bold text-xl mb-8">AI Financial Health</h3>
        
        <div className="relative flex items-center justify-center w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/5" />
            <motion.circle
              cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none"
              className={cn(data.overallScore >= 80 ? "text-success" : data.overallScore >= 60 ? "text-warning" : "text-destructive")}
              strokeDasharray="553"
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * data.overallScore) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-display font-bold">{data.overallScore}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">out of 100</span>
          </div>
        </div>

        <div className={cn(
          "px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider border",
          data.overallScore >= 80 ? "bg-success/10 text-success border-success/20" : 
          data.overallScore >= 60 ? "bg-warning/10 text-warning border-warning/20" : 
          "bg-destructive/10 text-destructive border-destructive/20"
        )}>
          Status: {data.status}
        </div>
      </div>

      {/* Middle: Breakdown */}
      <div className="flex flex-col lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
        <h4 className="font-display font-bold mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Metrics Breakdown
        </h4>
        <div className="flex-1 flex flex-col justify-center">
          <ScoreBar icon={PieChart} label="Diversification" score={data.breakdown.diversification} />
          <ScoreBar icon={ShieldAlert} label="Risk Exposure" score={data.breakdown.risk} />
          <ScoreBar icon={Zap} label="Liquidity" score={data.breakdown.liquidity} />
          <ScoreBar icon={TrendingUp} label="Yield Efficiency" score={data.breakdown.yieldEfficiency} />
          <ScoreBar icon={Activity} label="On-Chain Activity" score={data.breakdown.activity} />
        </div>
      </div>

      {/* Right: AI Insights & Recommendations */}
      <div className="flex flex-col lg:w-1/3">
        <h4 className="font-display font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" /> AI Insights
        </h4>
        <div className="space-y-3 mb-6">
          {data.observations.slice(0, 2).map((obs, i) => (
            <div key={i} className="text-sm text-muted-foreground bg-white/5 rounded-lg p-3 border border-white/5">
              {obs}
            </div>
          ))}
        </div>

        <h4 className="font-display font-bold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" /> Recommendations
        </h4>
        <div className="space-y-4">
          {data.recommendations.map(rec => (
            <motion.div 
              key={rec.id}
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-bold text-sm">{rec.title}</h5>
                <span className="text-xs font-mono text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                  +{rec.impact} Score
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{rec.reason}</p>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                <span className="text-primary font-semibold">AI Confidence</span>
                <span className="font-mono">{formatPercentage(rec.confidence)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
