import { useEffect, useState } from "react";
import { eventBus, EventPayload } from "@/services/eventBus";
import { Clock, History } from "lucide-react";

export function AgentMemory() {
  const [history, setHistory] = useState<EventPayload[]>([]);

  useEffect(() => {
    // Get initial history
    setHistory(eventBus.getHistory());
    
    // Subscribe to all relevant events for the timeline
    const unsub = eventBus.subscribeAll(() => {
      setHistory(eventBus.getHistory());
    });
    
    return unsub;
  }, []);

  // Filter out internal high-frequency state updates, keep major milestones
  const timelineEvents = history
    .filter(e => 
      e.type === "TransactionEvent" || 
      e.type === "SimulationEvent" || 
      e.type === "MarketEvent" ||
      e.type === "WalletEvent"
    )
    .slice(0, 10);

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-[400px] flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
        <History className="w-4 h-4 text-primary" />
        <h3 className="font-display font-bold">Agent Memory Timeline</h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        {timelineEvents.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center mt-10">No recent actions in memory.</div>
        ) : (
          <div className="space-y-4">
            {timelineEvents.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-primary/50 mt-1.5" />
                  {idx !== timelineEvents.length - 1 && <div className="w-px h-full bg-white/10 my-1" />}
                </div>
                <div className="pb-4">
                  <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm">
                    {event.data.message || (event.type === "WalletEvent" ? "Wallet interacting" : "Agent processing")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
