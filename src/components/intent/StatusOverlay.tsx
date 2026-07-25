import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ExternalLink, Brain, ShieldCheck, Route, Send, PartyPopper } from "lucide-react";

const steps = [
  { label: "Parsing intent", icon: Brain },
  { label: "Risk analysis", icon: ShieldCheck },
  { label: "Solver finding best route", icon: Route },
  { label: "Executing on Solana", icon: Send },
  { label: "Success", icon: PartyPopper },
];

interface Props { 
  open: boolean; 
  onClose: () => void; 
  signature?: string | null;
}

export const StatusOverlay = ({ open, onClose, signature }: Props) => {
  const [step, setStep] = useState(0);
  const sig = signature || "5Jq8x2nA9PqW3vYbHk4fG7tZmL6cN1RsEt8uVx2yQpD3wKjF9hMnB4aXcVbNgRtY";

  useEffect(() => {
    if (!open) { setStep(0); return; }
    if (step >= steps.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [open, step]);

  if (!open) return null;
  const done = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-xl animate-fade-in">
      <div className="glass-card mx-4 w-full max-w-md rounded-2xl p-8 animate-scale-in">
        <div className="mb-6 text-center">
          <h3 className="font-display text-xl font-semibold">
            {done ? "Transaction confirmed" : "Executing your intent"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {done ? "Your swap landed on Solana mainnet." : "This usually takes a few seconds."}
          </p>
        </div>

        <ol className="space-y-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < step || done;
            const isActive = i === step && !done;
            return (
              <li
                key={s.label}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                  isActive
                    ? "border-primary/40 bg-primary/5"
                    : isDone
                    ? "border-teal/30 bg-teal/5"
                    : "border-border bg-muted/20 opacity-50"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    isDone ? "bg-teal/15 text-teal" : isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : isActive ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-sm ${isActive ? "text-foreground" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        {done && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <a
              href={`https://explorer.solana.com/tx/${sig}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm hover:border-primary/40"
            >
              <span className="font-mono text-xs text-muted-foreground truncate pr-2">{sig.slice(0, 24)}...</span>
              <span className="flex items-center gap-1 text-primary">View <ExternalLink className="h-3 w-3" /></span>
            </a>
            <Button onClick={onClose} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
