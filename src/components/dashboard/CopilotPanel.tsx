import { MessageSquare, Sparkles } from "lucide-react";

export function CopilotPanel() {
  const prompts = [
    "Why is my risk score high?",
    "What should I do with idle SOL?",
    "How can I increase yield?",
    "Rebalance my portfolio"
  ];

  return (
    <div className="glass-panel border border-primary/30 rounded-2xl p-6 h-full flex flex-col bg-gradient-to-br from-primary/5 to-transparent shadow-[0_0_30px_rgba(124,92,252,0.1)]">
      <h3 className="font-display font-bold flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Financial Copilot
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Ask the AI to analyze your portfolio or generate a specific strategy.
      </p>

      <div className="flex-1 flex flex-col justify-end">
        <div className="space-y-2 mb-4">
          {prompts.map(p => (
            <button key={p} className="w-full text-left bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors border border-white/5 rounded-lg px-4 py-2.5 text-sm text-foreground/80 flex items-center justify-between group">
              {p}
              <MessageSquare className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask AgentFi anything..." 
            className="w-full bg-background/50 border border-border/50 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:opacity-90">
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
