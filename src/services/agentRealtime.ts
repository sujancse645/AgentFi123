import { useAgentStore } from "@/store/useAgentStore";
import { AgentEvent } from "@/types/agents";

let isRunning = false;
let pollingInterval: NodeJS.Timeout | null = null;

// The backend doesn't exist yet, so realtime will simply poll the intent status
// if the backend *did* exist.
export function startAgentPolling() {
  if (isRunning) return;
  isRunning = true;
  
  // Example polling (noop if no current intent)
  pollingInterval = setInterval(async () => {
    const intentId = useAgentStore.getState().currentIntentId;
    if (!intentId) return;
    
    // In a real scenario, this fetches the latest intent state
    // const status = await agentApi.getIntentStatus(intentId);
    // useAgentStore.getState().hydrateFromBackend(status);
  }, 2000);
}

export function stopAgentPolling() {
  isRunning = false;
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}
