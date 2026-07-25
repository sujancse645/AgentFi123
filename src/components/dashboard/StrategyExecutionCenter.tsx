import { Rocket, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export function StrategyExecutionCenter() {
  const strategies = [
    { name: "Yield Maximizer Protocol", status: "Executing", step: "Supplying liquidity to Kamino", progress: 65, icon: Rocket, color: "text-primary" },
    { name: "Risk Rebalance 10%", status: "Awaiting Approval", step: "Signature required", progress: 20, icon: Clock, color: "text-warning" },
    { name: "Stablecoin Migration", status: "Completed", step: "Done", progress: 100, icon: CheckCircle2, color: "text-success" },
    { name: "Meme Exposure", status: "Failed", step: "Slippage tolerance exceeded", progress: 0, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold flex items-center gap-2 mb-6">
        <Rocket className="w-5 h-5 text-primary" />
        Strategy Execution Center
      </h3>

      <div className="flex-1 space-y-4">
        {strategies.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <h4 className="font-bold text-sm">{s.name}</h4>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold ${s.color}`}>
                {s.status}
              </span>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>{s.step}</span>
              <span>{s.progress}%</span>
            </div>

            <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
              <div 
                className={`h-full ${s.progress === 100 ? "bg-success" : s.progress === 0 ? "bg-destructive" : "bg-primary"}`} 
                style={{ width: `${s.progress}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
