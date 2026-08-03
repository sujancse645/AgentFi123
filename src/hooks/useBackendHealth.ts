import { useEffect } from "react";
import { agentApi } from "@/services/agentApi";
import { useAgentStore } from "@/store/useAgentStore";
import { startDemoEngine, stopDemoEngine } from "@/services/demoAgentEngine";
import { startAgentPolling, stopAgentPolling } from "@/services/agentRealtime";

export function useBackendHealth() {
  const setConnectionStatus = useAgentStore((state) => state.setConnectionStatus);

  useEffect(() => {
    let mounted = true;

    async function checkHealth() {
      if (!mounted) return;
      try {
        await agentApi.healthCheck();
        if (!mounted) return;
        setConnectionStatus("connected");
        startAgentPolling(); // Fallback polling if connected
        stopDemoEngine();
      } catch (error) {
        if (!mounted) return;
        if (import.meta.env.VITE_ENABLE_DEMO_FALLBACK === "true") {
          setConnectionStatus("demo");
          startDemoEngine();
        } else {
          setConnectionStatus("offline");
        }
      }
    }

    setConnectionStatus("connecting");
    checkHealth();

    const interval = setInterval(checkHealth, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
      stopAgentPolling();
      stopDemoEngine();
    };
  }, [setConnectionStatus]);
}
