import { useAgentStore } from "@/store/useAgentStore";
import { AlertCircle, WifiOff } from "lucide-react";

export function ConnectionBanner() {
  const status = useAgentStore(s => s.connectionStatus);

  if (status === "connected" || status === "connecting") return null;

  return (
    <div className="w-full bg-destructive/10 border-b border-destructive/20 p-2 flex items-center justify-center gap-2 text-xs font-semibold text-destructive">
      {status === "demo" ? (
        <>
          <AlertCircle className="w-4 h-4" />
          Backend unavailable. Running in Fallback Demo Mode.
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          Network Offline. Attempting to reconnect...
        </>
      )}
    </div>
  );
}
