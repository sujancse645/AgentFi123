import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock } from "lucide-react";
import { useAgentStore } from "@/store/useAgentStore";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 5) return "Just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function LiveActivityFeed() {
  const { activityHistory } = useAgentStore();

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="font-display font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Live Agent Network
        </h3>
        <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        {activityHistory.length === 0 ? (
          <EmptyState title="No Activity" message="Waiting for an intent to begin processing." />
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {activityHistory.map((act) => {
                const color = act.status === "error" ? "text-destructive" :
                              act.status === "warning" ? "text-warning" :
                              act.status === "success" ? "text-success" : "text-primary";
                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={cn("w-2 h-2 rounded-full mt-2 ring-4 ring-background", `bg-${color.split('-')[1]}`)} />
                      <div className="w-px h-full bg-white/10 my-1" />
                    </div>
                    <div className="pb-2 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={cn("text-xs font-bold uppercase tracking-wider truncate", color)}>
                          {act.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {getRelativeTime(act.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-snug break-words">
                        {act.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
