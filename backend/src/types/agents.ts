export type AgentStatus = "idle" | "queued" | "analyzing" | "working" | "waiting" | "completed" | "failed";

export interface AgentState {
  status: AgentStatus;
  progress: number;
  confidence: number;
  currentTask: string;
  message: string;
  lastUpdated: string;
}

export interface AgentNetworkState {
  planner: AgentState;
  risk: AgentState;
  market: AgentState;
  execution: AgentState;
}

export interface AgentActivity {
  id: string;
  timestamp: string;
  agent: string;
  title: string;
  message: string;
  status: "info" | "success" | "warning" | "error";
}
