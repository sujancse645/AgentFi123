import { motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";
import { BrainCircuit, ShieldCheck, LineChart, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentStatus } from "@/types/agents";

const PipelineNode = ({ 
  icon: Icon, 
  label, 
  status, 
  isLast = false 
}: { 
  icon: any, 
  label: string, 
  status: AgentStatus | "intent", 
  isLast?: boolean 
}) => {
  const isActive = status === "analyzing" || status === "working" || status === "waiting";
  const isCompleted = status === "completed" || status === "intent";
  const isFailed = status === "failed";

  return (
    <div className="relative flex flex-col items-center flex-1">
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center relative z-10 transition-all duration-500",
        isActive ? "bg-primary text-white shadow-[0_0_20px_rgba(124,92,252,0.6)] scale-110" : 
        isCompleted ? "bg-success/20 text-success border border-success/30" : 
        isFailed ? "bg-destructive/20 text-destructive border border-destructive/30" :
        "bg-white/5 border border-white/10 text-muted-foreground"
      )}>
        <Icon className="w-5 h-5" />
        {isActive && (
          <div className="absolute inset-0 rounded-xl border-2 border-primary animate-ping opacity-50" />
        )}
      </div>
      
      <span className={cn(
        "mt-3 text-[10px] uppercase tracking-wider font-bold text-center",
        isActive ? "text-primary" : isCompleted ? "text-success" : isFailed ? "text-destructive" : "text-muted-foreground"
      )}>
        {label}
      </span>

      {/* Connecting Line */}
      {!isLast && (
        <div className="absolute top-6 left-[60%] right-[-40%] h-[2px] -z-10">
          <div className="w-full h-full bg-white/5 rounded-full" />
          {/* Animated data particle if active or completed recently */}
          {(isActive || isCompleted) && !isFailed && (
            <motion.div 
              className="absolute top-[-1px] left-0 w-8 h-[4px] rounded-full bg-primary shadow-[0_0_10px_rgba(124,92,252,1)]"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "300%", opacity: [0, 1, 1, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

import { ServerCog } from "lucide-react";

export function CollaborationPipeline() {
  const { agents } = useAgentStore();

  const isSimulating = agents.execution.status === "working";
  const hasSimulated = agents.execution.status === "completed" || agents.execution.status === "waiting";
  const simulationStatus = isSimulating ? "working" : hasSimulated ? "completed" : "idle";

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6">
      <h3 className="font-display font-bold mb-8 text-foreground/90">Agent Collaboration Pipeline</h3>
      
      <div className="flex items-start justify-between relative px-2">
        <PipelineNode icon={Target} label="Intent" status="intent" />
        <PipelineNode icon={BrainCircuit} label="Planner" status={agents.planner.status} />
        <PipelineNode icon={ShieldCheck} label="Risk" status={agents.risk.status} />
        <PipelineNode icon={LineChart} label="Market" status={agents.market.status} />
        <PipelineNode icon={ServerCog} label="Simulation" status={simulationStatus} />
        <PipelineNode icon={Zap} label="Execution" status={agents.execution.status} isLast />
      </div>
    </div>
  );
}
