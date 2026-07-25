import { useEffect, useState } from "react";
import { agentApi } from "@/services/agentApi";
import { useAgentStore } from "@/store/useAgentStore";
import { startDemoEngine, stopDemoEngine } from "@/services/demoAgentEngine";
import { startAgentPolling, stopAgentPolling } from "@/services/agentRealtime";

export function useBackendHealth() {
  const setConnectionStatus = useAgentStore((state) => state.setConnectionStatus);
  const [init, setInit] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkHealth() {
      if (!mounted) return;
      try {
        await agentApi.healthCheck();
        setConnectionStatus("connected");
        startAgentPolling(); // Fallback polling if connected but no SSE
        stopDemoEngine();
      } catch (error) {
        if (import.meta.env.VITE_ENABLE_DEMO_FALLBACK === "true") {
          setConnectionStatus("demo");
          startDemoEngine();
        } else {
          setConnectionStatus("offline");
        }
      }
    }

    if (!init) {
      setConnectionStatus("connecting");
      checkHealth();
      setInit(true);
    }

    const interval = setInterval(checkHealth, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
      stopAgentPolling();
      stopDemoEngine();
    };
  }, [init, setConnectionStatus]);
}
