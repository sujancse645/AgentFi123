import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TrustMetric = ({ label, percentage, delay }: { label: string, percentage: number, delay: number }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center">
    <div className="relative w-20 h-20 mb-3">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="40" cy="40" r="36" className="stroke-white/10 fill-none" strokeWidth="8" />
        <motion.circle 
          cx="40" cy="40" r="36" 
          className="stroke-primary fill-none" 
          strokeWidth="8"
          strokeDasharray="226"
          initial={{ strokeDashoffset: 226 }}
          animate={{ strokeDashoffset: 226 - (226 * percentage) / 100 }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl">
        {percentage}%
      </div>
    </div>
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
  </div>
);

export function TrustCenter() {
  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <ShieldCheck className="w-5 h-5 text-primary" />
        AI Trust Center
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
        <TrustMetric label="Recommendation Accuracy" percentage={92} delay={0.1} />
        <TrustMetric label="Execution Success" percentage={99} delay={0.3} />
        <TrustMetric label="Consensus Reliability" percentage={89} delay={0.5} />
        <TrustMetric label="Risk Forecast Accuracy" percentage={91} delay={0.7} />
      </div>

      <div className="mt-6 bg-success/10 border border-success/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <h4 className="font-bold text-success text-sm">System Validated</h4>
            <span className="text-xs text-muted-foreground">Continuously audited by Market Agent</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Portfolio Improvement</span>
          <span className="font-display font-bold text-xl text-success">+14%</span>
        </div>
      </div>
    </div>
  );
}
