import { useAgentStore } from "@/store/useAgentStore";
import { agentApi } from "./agentApi";

let isRunning = false;
let pollingInterval: NodeJS.Timeout | null = null;

export function startAgentPolling() {
  if (isRunning) return;
  isRunning = true;
  
  pollingInterval = setInterval(async () => {
    try {
      // 1. Fetch Agents State
      const state = await agentApi.getAgentNetworkState();
      
      // 2. Fetch Activity
      const activity = await agentApi.getAgentActivity();

      // Hydrate Zustand store
      useAgentStore.getState().hydrateFromBackend({
        agents: state as any,
        activityHistory: activity as any
      });
      
      // Check if workflow has finished to stop polling
      const intentStatus = useAgentStore.getState().agents?.execution?.status;
      if (intentStatus === "completed" || intentStatus === "failed") {
        // We do not automatically stop here because they might want to see updates,
        // but we can stop to save serverless resources.
        stopAgentPolling();
      }
      
    } catch (e) {
      console.error("Polling error:", e);
    }
  }, 2000); // 2-second polling for Serverless compatibility
}

export function stopAgentPolling() {
  isRunning = false;
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}
