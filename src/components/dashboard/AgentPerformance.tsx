import { motion } from "framer-motion";
import { BrainCircuit, Activity, BarChart3, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AgentPerformance() {
  const agents = [
    { name: "Risk Agent", accuracy: 96, generated: "$0 (Preserved)", tasks: 124 },
    { name: "Market Agent", accuracy: 91, generated: "$450", tasks: 890 },
    { name: "Planner Agent", accuracy: 94, generated: "$210", tasks: 45 },
    { name: "Execution Agent", accuracy: 99.8, generated: "$0", tasks: 88 },
  ];

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        Agent Impact Analytics
      </h3>

      <div className="flex-1 space-y-6">
        {agents.map((a, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">{a.name}</span>
              <span className="text-xs font-mono text-primary font-bold">{a.accuracy}% Accuracy</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${a.accuracy}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <span>{a.tasks} Tasks Completed</span>
              <span className="text-success">{a.generated} Value</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
