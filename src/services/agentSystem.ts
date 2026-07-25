import { useState, useEffect } from "react";
import { eventBus } from "./eventBus";

export type AgentStatus = "idle" | "thinking" | "analyzing" | "generating_recommendation" | "ready" | "executing" | "completed";

export interface Agent {
  id: "planner" | "risk" | "market" | "execution" | "portfolio" | "recommendation" | "health";
  name: string;
  status: AgentStatus;
  currentTask: string;
  confidence: number;
}

export interface SystemHealth {
  cpu: number;
  load: number;
  responseTime: number;
  queue: number;
  globalStatus: "Operational" | "Processing" | "Attention Required" | "Execution In Progress";
}

export interface GlobalMetrics {
  activeAgents: number;
  tasksRunning: number;
  successRate: number;
  totalIntents: number;
}

// Data Abstraction Layer: Mock Engine using EventBus
class MockAgentSystem {
  public agents: Record<string, Agent> = {
    planner: { id: "planner", name: "Planner Agent", status: "idle", currentTask: "Awaiting Intent", confidence: 99 },
    risk: { id: "risk", name: "Risk Agent", status: "idle", currentTask: "Monitoring", confidence: 100 },
    market: { id: "market", name: "Market Agent", status: "idle", currentTask: "Scanning Liquidity", confidence: 95 },
    execution: { id: "execution", name: "Execution Agent", status: "idle", currentTask: "Standby", confidence: 100 },
    portfolio: { id: "portfolio", name: "Portfolio Agent", status: "idle", currentTask: "Tracking Assets", confidence: 98 },
    recommendation: { id: "recommendation", name: "Recommendation Agent", status: "idle", currentTask: "Scanning Ops", confidence: 92 },
    health: { id: "health", name: "Health Agent", status: "idle", currentTask: "Monitoring Vitais", confidence: 100 },
  };

  public health: SystemHealth = { cpu: 12, load: 15, responseTime: 120, queue: 0, globalStatus: "Operational" };
  public metrics: GlobalMetrics = { activeAgents: 4, tasksRunning: 0, successRate: 99.8, totalIntents: 1420 };
  
  private intervalId: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor() {
    this.startMockEngine();
  }

  private notify(type: "AgentStateChange" | "SystemHealthEvent") {
    if (type === "AgentStateChange") {
      eventBus.emit("AgentStateChange", { agents: this.agents });
    } else {
      eventBus.emit("SystemHealthEvent", { health: this.health, metrics: this.metrics });
    }
  }

  private addActivity(agentId: string, message: string) {
    eventBus.emit("TransactionEvent", { agentId, message });
  }

  public setAgentState(id: string, status: AgentStatus, task: string, confidence: number) {
    this.agents[id].status = status;
    this.agents[id].currentTask = task;
    this.agents[id].confidence = confidence;
    this.notify("AgentStateChange");
  }

  // Simulates processing an intent through the explicit agent state machine
  public async simulateIntentProcessing(intentSummary: string) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.metrics.tasksRunning++;
    this.health.globalStatus = "Processing";
    this.notify("SystemHealthEvent");

    eventBus.emit("WalletEvent", { message: `New intent received: "${intentSummary}"` });

    // 1. Planner Agent
    this.setAgentState("planner", "thinking", "Parsing Intent Natural Language", 85);
    this.health.cpu = 45; this.notify("SystemHealthEvent");
    this.addActivity("planner", "Planner Agent analyzing raw user intent...");
    await this.delay(800);
    
    this.setAgentState("planner", "analyzing", "Breaking down required steps", 92);
    await this.delay(800);
    
    this.setAgentState("planner", "generating_recommendation", "Formulating strategy", 98);
    await this.delay(800);
    
    this.setAgentState("planner", "completed", "Generated execution strategy", 99);
    eventBus.emit("SimulationEvent", { source: "planner", message: "Strategy formulated" });

    // 2. Risk Agent
    this.setAgentState("risk", "thinking", "Loading protocol data", 90);
    this.addActivity("risk", "Risk Agent evaluating protocol exposure and smart contract safety.");
    await this.delay(800);
    
    this.setAgentState("risk", "analyzing", "Evaluating token safety & volatility", 94);
    this.health.cpu = 65; this.notify("SystemHealthEvent");
    await this.delay(800);
    
    this.setAgentState("risk", "generating_recommendation", "Calculating Risk Score", 97);
    await this.delay(800);
    
    this.setAgentState("risk", "completed", "Risk assessment passed", 99);

    // 3. Market Agent
    this.setAgentState("market", "thinking", "Fetching orderbooks", 88);
    this.addActivity("market", "Market Agent identifying optimal routes and slippage tolerances.");
    await this.delay(800);
    
    this.setAgentState("market", "analyzing", "Scanning cross-DEX liquidity", 92);
    this.health.cpu = 85; this.notify("SystemHealthEvent");
    await this.delay(1000);
    
    this.setAgentState("market", "generating_recommendation", "Optimizing routing paths", 95);
    await this.delay(800);
    
    this.setAgentState("market", "completed", "Optimal route found", 96);
    eventBus.emit("MarketEvent", { message: "Liquidity secured on Jupiter v6" });

    // 4. Execution Agent Simulation
    this.setAgentState("execution", "ready", "Awaiting execution handoff", 100);
    await this.delay(500);

    this.health.globalStatus = "Execution In Progress";
    this.notify("SystemHealthEvent");
    
    this.setAgentState("execution", "executing", "Simulating transaction", 91);
    this.addActivity("execution", "Execution Agent simulating transaction in sandbox environment.");
    await this.delay(1200);

    this.setAgentState("execution", "completed", "Ready for signature", 99);
    this.health.cpu = 20;
    this.metrics.tasksRunning--;
    this.metrics.totalIntents++;
    this.health.globalStatus = "Attention Required"; // Waiting for user sig
    this.notify("SystemHealthEvent");
    
    this.addActivity("execution", "Execution Agent prepared route. Awaiting user confirmation.");
    this.isProcessing = false;
  }

  public completeExecution() {
     this.health.globalStatus = "Operational";
     this.notify("SystemHealthEvent");
     this.resetAgents();
  }

  private resetAgents() {
    this.agents.planner.status = "idle";
    this.agents.planner.currentTask = "Awaiting Intent";
    this.agents.risk.status = "idle";
    this.agents.risk.currentTask = "Monitoring";
    this.agents.market.status = "idle";
    this.agents.market.currentTask = "Scanning Liquidity";
    this.agents.execution.status = "idle";
    this.agents.execution.currentTask = "Standby";
    this.agents.portfolio.status = "idle";
    this.agents.portfolio.currentTask = "Tracking Assets";
    this.agents.recommendation.status = "idle";
    this.agents.recommendation.currentTask = "Scanning Ops";
    this.agents.health.status = "idle";
    this.agents.health.currentTask = "Monitoring Vitals";
    this.notify("AgentStateChange");
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Periodic ambient fluctuations
  private startMockEngine() {
    this.intervalId = setInterval(() => {
      this.health.cpu = this.isProcessing ? this.health.cpu + (Math.random() * 10 - 5) : 10 + Math.random() * 5;
      this.health.load = this.isProcessing ? this.health.load + (Math.random() * 5 - 2) : 15 + Math.random() * 2;
      this.health.responseTime = 100 + Math.random() * 40;
      
      if (!this.isProcessing) {
         Object.values(this.agents).forEach(agent => {
           if (agent.status === "idle") {
             agent.confidence = Math.min(100, Math.max(90, agent.confidence + (Math.random() * 2 - 1)));
           }
         });
      }

      this.notify("SystemHealthEvent");
      this.notify("AgentStateChange");
    }, 2000);

    // Simulate an organic background task every 15 seconds
    setInterval(() => {
      if (!this.isProcessing && Math.random() > 0.5) {
        this.addActivity("market", "Market Agent detected anomaly in liquidity pools. Analyzing...");
        this.agents.market.status = "analyzing";
        this.agents.market.currentTask = "Anomaly detection";
        this.notify("AgentStateChange");
        setTimeout(() => {
          this.agents.market.status = "idle";
          this.agents.market.currentTask = "Scanning Liquidity";
          this.notify("AgentStateChange");
        }, 3000);
      }
    }, 15000);
  }

  public stopMockEngine() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

export const agentSystem = new MockAgentSystem();

// React Hook to consume the system data
export function useAgentSystem() {
  const [state, setState] = useState({
    agents: agentSystem.agents,
    health: agentSystem.health,
    metrics: agentSystem.metrics,
  });

  useEffect(() => {
    const unsub1 = eventBus.subscribe("AgentStateChange", (payload) => {
      setState(s => ({ ...s, agents: { ...payload.data.agents } }));
    });
    const unsub2 = eventBus.subscribe("SystemHealthEvent", (payload) => {
      setState(s => ({ ...s, health: { ...payload.data.health }, metrics: { ...payload.data.metrics } }));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  return {
    ...state,
    simulateIntent: (summary: string) => agentSystem.simulateIntentProcessing(summary),
    completeExecution: () => agentSystem.completeExecution(),
  };
}
