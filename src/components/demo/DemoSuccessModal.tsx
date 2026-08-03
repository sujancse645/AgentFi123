import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DemoSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mockSignature?: string;
}

export function DemoSuccessModal({ open, onOpenChange, mockSignature }: DemoSuccessModalProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (open) {
      setStage(0);
      const timer1 = setTimeout(() => setStage(1), 800);
      const timer2 = setTimeout(() => setStage(2), 1600);
      const timer3 = setTimeout(() => setStage(3), 2400);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-md border-success/30 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <div 
            className="h-full bg-success transition-all duration-700 ease-out"
            style={{ width: stage === 0 ? "33%" : stage === 1 ? "66%" : "100%" }}
          />
        </div>

        <div className="pt-6 pb-2">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className={cn("absolute inset-0 rounded-full border-4 border-success/20", stage >= 3 && "animate-ping")} />
            <div className="absolute inset-0 flex items-center justify-center bg-success/10 rounded-full">
              <CheckCircle2 className={cn("w-10 h-10 text-success transition-all duration-500", stage >= 3 ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
            </div>
          </div>

          <h2 className="text-2xl font-bold font-display mb-2">Demo Execution Successful</h2>
          <p className="text-muted-foreground mb-8">
            The multi-agent workflow completed securely in simulation mode.
          </p>

          <div className="space-y-3 text-left bg-black/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className={cn("w-5 h-5 transition-colors", stage >= 1 ? "text-primary" : "text-muted-foreground/30")} />
              <span className={cn("text-sm transition-opacity", stage >= 1 ? "opacity-100" : "opacity-30")}>
                Risk Assessment Passed
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Cpu className={cn("w-5 h-5 transition-colors", stage >= 2 ? "text-primary" : "text-muted-foreground/30")} />
              <span className={cn("text-sm transition-opacity", stage >= 2 ? "opacity-100" : "opacity-30")}>
                Execution Agents Synced
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className={cn("w-5 h-5 transition-colors", stage >= 3 ? "text-success" : "text-muted-foreground/30")} />
              <span className={cn("text-sm transition-opacity", stage >= 3 ? "opacity-100" : "opacity-30")}>
                Mock Transaction Broadcasted
              </span>
            </div>
          </div>

          {stage >= 3 && (
            <div className="animate-fade-in-up">
              <div className="text-xs text-muted-foreground mb-4 break-all bg-white/5 p-2 rounded border border-white/10 font-mono">
                {mockSignature || "DEMO-AGENTFI-SUCCESS"}
              </div>
              <Button 
                className="w-full bg-success text-success-foreground hover:bg-success/90"
                onClick={() => onOpenChange(false)}
              >
                Continue Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
