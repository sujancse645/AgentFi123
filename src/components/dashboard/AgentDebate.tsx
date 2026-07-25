import { motion } from "framer-motion";
import { ShieldAlert, LineChart, TrendingUp, PieChart, CheckCircle2, User, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AgentDebate() {
  const debate = [
    { agent: "Risk", icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", stance: "caution", message: "Potential exposure remains elevated. Recommend hedging downside risk." },
    { agent: "Market", icon: LineChart, color: "text-success", bg: "bg-success/10", border: "border-success/20", stance: "approve", message: "Bullish market conditions strongly favor staking at current levels." },
    { agent: "Yield", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", stance: "approve", message: "Expected annual return 7.8%. Favorable relative to stablecoin baseline." },
    { agent: "Portfolio", icon: PieChart, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", stance: "approve", message: "Diversification remains acceptable post-execution." },
  ];

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="font-display font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Agent Debate Engine
        </h3>
        <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Live Session
        </div>
      </div>

      <div className="bg-background/80 border border-white/10 rounded-xl p-4 mb-6 relative z-10 flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">Scenario Evaluation</span>
          <h4 className="font-bold text-sm">Should the user stake 50% of idle SOL?</h4>
        </div>
      </div>

      <div className="flex-1 space-y-4 relative z-10 overflow-y-auto no-scrollbar pr-2">
        {debate.map((d, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", d.bg, d.border, d.color)}>
                <d.icon className="w-4 h-4" />
              </div>
              {i !== debate.length - 1 && <div className="w-px h-full bg-white/10 my-2" />}
            </div>
            <div className="pb-4 pt-1">
              <span className={cn("text-xs uppercase tracking-wider font-bold mb-1 block", d.color)}>{d.agent} Agent</span>
              <p className="text-sm text-foreground/90">{d.message}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Final Consensus</span>
          <span className="font-display font-bold text-success flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> 82% Agreement
          </span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-success rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "82%" }}
            transition={{ duration: 1, delay: 1.8 }}
          />
        </div>
      </div>
    </div>
  );
}
