import { Monitor, Expand, LayoutDashboard, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function PresentationMode() {
  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Monitor className="w-10 h-10 text-primary" />
      </div>
      
      <h2 className="font-display text-2xl font-bold mb-4">Presentation Mode</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Optimize the dashboard for large displays. Hides navigation, expands charts to fullscreen, and enables guided storytelling.
      </p>

      <div className="flex gap-4">
        <button 
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {
                toast.error("Fullscreen API not supported");
              });
              toast.success("Presentation Mode Activated");
            } else {
              document.exitFullscreen();
              toast.info("Exited Presentation Mode");
            }
          }}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
        >
          <Expand className="w-4 h-4" /> Toggle Fullscreen
        </button>
        <button 
          onClick={() => toast.success("Layout Reset")}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" /> Reset Layout
        </button>
      </div>
    </div>
  );
}
