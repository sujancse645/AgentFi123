const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "/api";

export class AgentApiError extends Error {
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "AgentApiError";
    this.status = status;
    this.details = details;
  }
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: unknown;
}

interface SubmitIntentPayload {
  intent: string;
  wallet: string;
}

interface CopilotChatResponse {
  answer: string;
  provider?: string;
  model?: string;
  isFallback?: boolean;
  dataSource?: string | null;
  dataTimestamp?: string | null;
  timestamp?: string;
}

interface DemoExecutePayload {
  demoSessionId: string;
  intentId?: string;
  intent: string;
  simulation?: Record<string, unknown>;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

async function fetchWithTimeout<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 8_000,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });

    const responseBody = await parseResponseBody(response);

    if (!response.ok) {
      const apiError =
        typeof responseBody === "object" && responseBody !== null
          ? (responseBody as ApiErrorResponse)
          : null;

      const message =
        apiError?.message ||
        apiError?.error ||
        (typeof responseBody === "string" ? responseBody : null) ||
        `Request failed with status ${response.status}`;

      throw new AgentApiError(message, response.status, responseBody);
    }

    return responseBody as T;
  } catch (error: unknown) {
    if (error instanceof AgentApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AgentApiError("Request timed out. Please try again.", 408);
    }

    if (error instanceof Error) {
      throw new AgentApiError(error.message || "Network request failed.");
    }

    throw new AgentApiError("An unknown network error occurred.");
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function jsonRequest(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export const agentApi = {
  healthCheck: <T = unknown>() =>
    fetchWithTimeout<T>("/health", {}, 5_000),

  getAgentNetworkState: <T = unknown>() =>
    fetchWithTimeout<T>("/agents/state"),

  getAgentActivity: <T = unknown>() =>
    fetchWithTimeout<T>("/agents/activity"),

  submitIntent: <T = unknown>(payload: SubmitIntentPayload) =>
    fetchWithTimeout<T>("/intents", jsonRequest(payload), 15_000),

  getIntentStatus: <T = unknown>(intentId: string) =>
    fetchWithTimeout<T>(
      `/intents/${encodeURIComponent(intentId)}`,
    ),

  simulateIntent: <T = unknown>(
    intentId: string,
    payload: Record<string, unknown>,
  ) =>
    fetchWithTimeout<T>(
      `/intents/${encodeURIComponent(intentId)}/simulate`,
      jsonRequest(payload),
      30_000,
    ),

  prepareTransaction: <T = unknown>(
    intentId: string,
    payload: Record<string, unknown>,
  ) =>
    fetchWithTimeout<T>(
      `/intents/${encodeURIComponent(intentId)}/prepare`,
      jsonRequest(payload),
      30_000,
    ),

  submitTransactionResult: <T = unknown>(
    intentId: string,
    signature: string,
    status: string,
  ) =>
    fetchWithTimeout<T>(
      `/intents/${encodeURIComponent(intentId)}/result`,
      jsonRequest({
        signature,
        status,
      }),
      20_000,
    ),

  getTransaction: <T = unknown>(signature: string) =>
    fetchWithTimeout<T>(
      `/transactions/${encodeURIComponent(signature)}`,
    ),

  getTransactions: <T = unknown>(params?: { wallet?: string, mode?: string, demoSessionId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.wallet) searchParams.append("wallet", params.wallet);
    if (params?.mode) searchParams.append("mode", params.mode);
    if (params?.demoSessionId) searchParams.append("demoSessionId", params.demoSessionId);
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return fetchWithTimeout<T>(`/transactions${query}`);
  },

  copilotChat: (
    message: string,
    walletAddress?: string,
  ): Promise<CopilotChatResponse> =>
    fetchWithTimeout<CopilotChatResponse>(
      "/copilot/chat",
      jsonRequest({
        message: message.trim(),
        ...(walletAddress ? { walletAddress } : {}),
      }),
      45_000,
    ),

  executeDemo: <T = unknown>(payload: DemoExecutePayload) =>
    fetchWithTimeout<T>(
      "/demo/execute",
      jsonRequest(payload),
      30_000,
    ),
};