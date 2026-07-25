import { BookOpen, Clock, Zap, ShieldAlert, LineChart } from "lucide-react";

export function FinancialJournal() {
  const events = [
    { type: "Execution", message: "Successfully executed Yield Maximizer Strategy", time: "10 mins ago", icon: Zap, color: "text-primary" },
    { type: "Alert", message: "Concentration risk exceeded 70% threshold", time: "2 hours ago", icon: ShieldAlert, color: "text-warning" },
    { type: "Simulation", message: "Simulated 50% SOL staking scenario", time: "5 hours ago", icon: LineChart, color: "text-success" },
    { type: "Recommendation", message: "Generated 'Convert 10% SOL to USDC' advice", time: "1 day ago", icon: BookOpen, color: "text-muted-foreground" },
  ];

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-primary" />
        AI Financial Journal
      </h3>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar relative">
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/10" />
        
        {events.map((e, i) => (
          <div key={i} className="flex gap-4 relative">
            <div className={`w-8 h-8 rounded-full bg-background flex items-center justify-center shrink-0 border border-white/10 ${e.color} z-10`}>
              <e.icon className="w-4 h-4" />
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">{e.type}</span>
                <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {e.time}
                </span>
              </div>
              <p className="text-sm text-foreground/80">{e.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
