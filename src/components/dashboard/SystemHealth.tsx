import { motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";
import { Cpu, HardDrive, Clock, List } from "lucide-react";
import { cn } from "@/lib/utils";

const HealthMetric = ({ 
  icon: Icon, 
  label, 
  value, 
  max, 
  unit = "", 
  inverse = false 
}: { 
  icon: any, 
  label: string, 
  value: number, 
  max: number, 
  unit?: string,
  inverse?: boolean 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Determine color based on threshold
  let colorClass = "bg-primary";
  if ((inverse && percentage < 30) || (!inverse && percentage > 70)) {
    colorClass = "bg-warning";
  }
  if ((inverse && percentage < 10) || (!inverse && percentage > 90)) {
    colorClass = "bg-destructive";
  }

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
        </div>
        <span className="text-sm font-mono font-medium">
          {value.toFixed(label === "Response Time" ? 0 : 1)}{unit}
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className={cn("h-full rounded-full", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export function SystemHealth() {
  const store = useAgentStore();

  // Mocking CPU and Response time as derived from load, since store has systemLoad
  const cpu = Math.min(100, store.systemLoad * 0.8 + 12);
  const responseTime = store.connectionStatus === "connected" ? 120 + Math.random() * 40 : 
                       store.connectionStatus === "demo" ? 45 + Math.random() * 10 : 999;

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-foreground/90">Infrastructure Health</h3>
        <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
          store.connectionStatus === "connected" ? "bg-success/10 text-success border-success/20" :
          store.connectionStatus === "demo" ? "bg-warning/10 text-warning border-warning/20" :
          "bg-destructive/10 text-destructive border-destructive/20"
        )}>
          {store.connectionStatus === "connected" ? "Optimal" : store.connectionStatus === "demo" ? "Local Demo" : "Offline"}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <HealthMetric icon={Cpu} label="Neural Core Load" value={cpu} max={100} unit="%" />
        <HealthMetric icon={HardDrive} label="Memory Usage" value={store.systemLoad} max={100} unit="%" />
        <HealthMetric icon={Clock} label="Response Time" value={responseTime} max={500} unit="ms" />
        <HealthMetric icon={List} label="Task Queue" value={store.tasksRunning} max={10} unit=" active" />
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-muted-foreground">
        <span>Uptime: {store.connectionStatus === "offline" ? "0.00%" : "99.99%"}</span>
        <span>Node: sol-mainnet-beta</span>
      </div>
    </div>
  );
}
