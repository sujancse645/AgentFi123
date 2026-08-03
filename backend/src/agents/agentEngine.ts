import { AgentNetworkState, AgentActivity, AgentState } from "../types/agents.js";
import { prisma } from "../prisma.js";

class AgentEngine {
  
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

  async getState(): Promise<AgentNetworkState> {
    const state = this.getInitialState();
    
    const types = ["planner", "risk", "market", "execution"];
    for (const type of types) {
      const latestEvent = await prisma.agentEvent.findFirst({
        where: { agentType: type },
        orderBy: { createdAt: 'desc' }
      });
      
      if (latestEvent) {
        state[type as keyof AgentNetworkState] = {
          status: latestEvent.status as any,
          progress: latestEvent.progress,
          confidence: latestEvent.confidence,
          currentTask: latestEvent.metadata ? JSON.parse(latestEvent.metadata).currentTask : "",
          message: latestEvent.message,
          lastUpdated: latestEvent.createdAt.toISOString()
        };
      }
    }
    
    return state;
  }

  async getActivity(): Promise<AgentActivity[]> {
    const logs = await prisma.agentActivityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    
    return logs.map(log => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      agent: log.agent,
      title: log.title,
      message: log.message,
      status: log.status as "info" | "success" | "warning" | "error"
    }));
  }

  async updateAgent(agentName: keyof AgentNetworkState, updates: Partial<AgentState>) {
    const currentState = await this.getState();
    const agent = currentState[agentName];
    
    const status = updates.status ?? agent.status;
    const progress = updates.progress ?? agent.progress;
    const confidence = updates.confidence ?? agent.confidence;
    const message = updates.message ?? agent.message;
    const currentTask = updates.currentTask ?? agent.currentTask;

    await prisma.agentEvent.create({
      data: {
        agentType: agentName,
        status: status,
        progress: progress,
        confidence: confidence,
        message: message,
        metadata: JSON.stringify({ currentTask: currentTask })
      }
    });
  }

  async addActivity(activity: Omit<AgentActivity, "id" | "timestamp">) {
    await prisma.agentActivityLog.create({
      data: {
        agent: activity.agent,
        title: activity.title,
        message: activity.message,
        status: activity.status
      }
    });
  }

  async reset() {
    // Optionally delete all AgentEvents and AgentActivityLogs if a true reset is desired.
    // For Vercel Serverless, we might just want to leave historical logs, or clear them.
    await prisma.agentEvent.deleteMany({});
    await prisma.agentActivityLog.deleteMany({});
  }
}

export const agentEngine = new AgentEngine();
