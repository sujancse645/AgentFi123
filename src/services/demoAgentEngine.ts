import { useAgentStore } from "@/store/useAgentStore";
import { AgentEvent } from "@/types/agents";

let demoActive = false;
let ambientInterval: NodeJS.Timeout | null = null;
let processing = false;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function startDemoEngine() {
  if (demoActive) return;
  demoActive = true;
  
  // Ambient fluctuations to keep the dashboard alive
  ambientInterval = setInterval(() => {
    if (!demoActive || processing) return;
    const store = useAgentStore.getState();
    store.hydrateFromBackend({
      systemLoad: 15 + (Math.random() * 5),
    });
  }, 3000);
}

export function stopDemoEngine() {
  demoActive = false;
  if (ambientInterval) clearInterval(ambientInterval);
}

export async function simulateIntentInDemo(intentId: string, summary: string) {
  if (processing) return;
  processing = true;
  const store = useAgentStore.getState();
  
  store.startIntent(intentId, summary);
  store.hydrateFromBackend({ systemLoad: 85 });

  // 1. Planner
  store.setAgentStatus("planner", "working");
  store.setAgentTask("planner", "Analyzing raw user intent...");
  store.setAgentProgress("planner", 15);
  await delay(800);
  store.setAgentTask("planner", "Decomposing into execution steps");
  store.setAgentProgress("planner", 60);
  await delay(700);
  store.completeAgentTask("planner", "Generated execution plan", 99);
  store.addActivity({ type: "plan", title: "Plan Generated", message: "Planner parsed intent into 4 sub-tasks", status: "success" });

  // 2. Risk
  store.setAgentStatus("risk", "analyzing");
  store.setAgentTask("risk", "Evaluating protocol exposure");
  store.setAgentProgress("risk", 30);
  await delay(800);
  store.setAgentTask("risk", "Checking wallet balances and volatility");
  store.setAgentProgress("risk", 80);
  await delay(900);
  store.completeAgentTask("risk", "Risk assessment passed", 97);
  store.addActivity({ type: "risk", title: "Risk Verified", message: "Transaction falls within acceptable safety parameters", status: "success" });

  // 3. Market
  store.setAgentStatus("market", "working");
  store.setAgentTask("market", "Scanning cross-DEX liquidity");
  store.setAgentProgress("market", 40);
  await delay(1000);
  store.completeAgentTask("market", "Optimal route secured via Jupiter v6", 96);
  store.addActivity({ type: "market", title: "Route Found", message: "Best execution route found with minimal slippage", status: "success" });

  // 4. Execution (Waiting)
  store.setAgentStatus("execution", "waiting");
  store.setAgentTask("execution", "Awaiting simulation and approval");
  store.addActivity({ type: "execution", title: "Awaiting Signature", message: "Ready for user simulation approval", status: "warning" });

  processing = false;
  store.hydrateFromBackend({ systemLoad: 20 });
}

export async function confirmExecutionInDemo() {
  const store = useAgentStore.getState();
  store.setAgentStatus("execution", "working");
  store.setAgentTask("execution", "Preparing Solana Transaction");
  store.setAgentProgress("execution", 50);
  await delay(1200);
  store.setAgentTask("execution", "Awaiting confirmation");
  store.setAgentProgress("execution", 95);
  await delay(1000);
  store.completeAgentTask("execution", "Transaction submitted successfully", 100);
  store.addActivity({ type: "execution", title: "Transaction Confirmed", message: "Executed strictly along planned route", status: "success" });
  
  await delay(3000);
  store.resetAgents();
}
