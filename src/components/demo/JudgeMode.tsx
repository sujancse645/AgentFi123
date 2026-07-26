import { Play, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function JudgeMode() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "Executive Briefing", desc: "Start with a high-level summary of the portfolio health and immediate opportunities." },
    { title: "Financial Health", desc: "Show the deep 0-100 scoring system and AI insights." },
    { title: "AI Recommendations", desc: "Demonstrate proactive intelligence generating actionable advice." },
    { title: "Agent Debate", desc: "Show the multi-agent consensus engine publicly debating a strategy." },
    { title: "Strategy Lab", desc: "Run a Monte Carlo simulation on the 'Stake SOL' scenario." },
    { title: "One-Click Execution", desc: "Execute the strategy using real Jupiter routing and wallet signature." },
    { title: "Enterprise Report", desc: "Generate a boardroom-ready PDF summarizing the portfolio." },
  ];

  return (
    <div className="glass-panel border border-primary/30 rounded-2xl p-8 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles className="w-64 h-64 text-primary" />
      </div>

      <div className="relative z-10">
        <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          Judge Evaluation Mode
        </h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Welcome Judges. This guided walkthrough will demonstrate the full capabilities of AgentFi, transforming from a simple dashboard into a proactive AI Wealth Operating System.
        </p>

        <button 
          onClick={() => {
            if (activeStep > 0) return;
            toast.info("Demo Sequence Initiated", { description: "Running automated walkthrough..." });
            let step = 0;
            const interval = setInterval(() => {
              step++;
              if (step >= steps.length) {
                clearInterval(interval);
                toast.success("Demo Sequence Complete");
              }
              setActiveStep(step);
            }, 2500);
          }}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 mb-12"
        >
          <Play className="w-5 h-5 fill-current" /> Start Hackathon Demo
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {steps.map((step, i) => (
            <div key={i} className={cn("flex gap-4 p-4 rounded-xl transition-colors", activeStep === i ? "bg-primary/10 border border-primary/20" : "opacity-70")}>
              <div className="flex flex-col items-center">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm", activeStep === i ? "bg-primary text-white" : activeStep > i ? "bg-success text-white" : "bg-white/10 text-muted-foreground")}>
                  {activeStep > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && i % 2 === 0 && <div className="w-px h-full bg-white/10 my-2" />}
              </div>
              <div>
                <h4 className="font-bold mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
