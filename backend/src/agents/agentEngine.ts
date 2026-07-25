import { AgentNetworkState, AgentActivity, AgentState } from "../types/agents";
import { EventEmitter } from "events";
import { prisma } from "../prisma";

class AgentEngine extends EventEmitter {
  private state: AgentNetworkState;
  private activity: AgentActivity[] = [];

  constructor() {
    super();
    this.state = this.getInitialState();
  }

  private getInitialState(): AgentNetworkState {
    const defaultState: AgentState = {
      status: "idle",
      progress: 0,
      confidence: 0,
      currentTask: "",
      message: "Ready",
      lastUpdated: new Date().toISOString()
    };
    
    return {
      planner: { ...defaultState },
      risk: { ...defaultState },
      market: { ...defaultState },
      execution: { ...defaultState }
    };
  }

  getState() {
    return this.state;
  }

  getActivity() {
    return this.activity;
  }

  updateAgent(agentName: keyof AgentNetworkState, updates: Partial<AgentState>) {
    this.state[agentName] = {
      ...this.state[agentName],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    // Save to DB (fire and forget)
    prisma.agentEvent.create({
      data: {
        agentType: agentName,
        status: this.state[agentName].status,
        progress: this.state[agentName].progress,
        confidence: this.state[agentName].confidence,
        message: this.state[agentName].message,
        metadata: JSON.stringify({ currentTask: this.state[agentName].currentTask })
      }
    }).catch(e => console.error("Prisma error:", e));

    this.emit("state_update", this.state);
  }

  addActivity(activity: Omit<AgentActivity, "id" | "timestamp">) {
    const newActivity: AgentActivity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    this.activity.unshift(newActivity);
    if (this.activity.length > 50) this.activity.pop();
    this.emit("activity_update", newActivity);
  }

  reset() {
    this.state = this.getInitialState();
    this.emit("state_update", this.state);
  }
}

export const agentEngine = new AgentEngine();
