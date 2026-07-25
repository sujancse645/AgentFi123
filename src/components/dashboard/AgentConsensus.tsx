import { motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentStatus } from "@/types/agents";

export function AgentConsensus() {
  const { agents } = useAgentStore();

  const isApproved = (status: AgentStatus) => ["working", "waiting", "completed"].includes(status);
  
  const votes = [
    { name: "Planner", approved: isApproved(agents.planner.status) },
    { name: "Risk", approved: isApproved(agents.risk.status) },
    { name: "Market", approved: isApproved(agents.market.status) },
  ];

  const approvedCount = votes.filter(v => v.approved).length;
  const isExecuting = agents.execution.status === "working" || agents.execution.status === "waiting" || agents.execution.status === "completed";
  const consensusLevel = isExecuting ? Math.max(90, (approvedCount / 3) * 100) : (approvedCount / 3) * 100;

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6">
      <h3 className="font-display font-bold mb-4">Agent Consensus Engine</h3>
      
      <div className="space-y-3 mb-6">
        {votes.map(v => (
          <div key={v.name} className="flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-lg border border-white/5">
            <span className="text-sm font-medium">{v.name} Agent</span>
            {v.approved ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-success uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" /> Pending
              </span>
            )}
          </div>
        ))}
        
        <div className="flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-lg border border-primary/20 bg-primary/5">
          <span className="text-sm font-medium">Execution Agent</span>
          {isExecuting ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
            </span>
          ) : (
             <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
               Standby
             </span>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Global Consensus</span>
          <span className="font-mono text-sm font-bold">{consensusLevel.toFixed(0)}% Agreement</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className={cn("h-full rounded-full", consensusLevel >= 90 ? "bg-success" : consensusLevel > 0 ? "bg-primary" : "bg-muted-foreground")}
            initial={{ width: 0 }}
            animate={{ width: `${consensusLevel}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
