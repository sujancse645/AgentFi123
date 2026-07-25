export type AgentId = 
  | "planner" 
  | "risk" 
  | "market" 
  | "execution" 
  | "portfolio" 
  | "recommendation" 
  | "health";

export type AgentStatus = 
  | "idle" 
  | "queued" 
  | "analyzing" 
  | "working" 
  | "waiting" 
  | "completed" 
  | "failed";

export interface AgentState {
  id: AgentId;
  name: string;
  status: AgentStatus;
  confidence: number;
  currentTask: string;
  message: string;
  progress: number;
  lastUpdated: string;
  error?: string;
}

export interface AgentNetworkState {
  online: boolean;
  activeAgents: number;
  tasksRunning: number;
  successRate: number;
  systemLoad: number;
  agents: AgentState[];
}

export interface AgentActivity {
  id: string;
  agentId?: AgentId;
  type: string;
  title: string;
  message: string;
  status: "info" | "success" | "warning" | "error";
  timestamp: string;
}

export interface AgentEvent {
  type:
    | "agent.started"
    | "agent.progress"
    | "agent.completed"
    | "agent.failed"
    | "intent.updated"
    | "simulation.completed"
    | "execution.completed";
  agentId?: AgentId;
  intentId?: string;
  progress?: number;
  confidence?: number;
  message?: string;
  timestamp: string;
}
