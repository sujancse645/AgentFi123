import { AIProvider } from "./aiProvider.js";
import { GeminiProvider } from "./geminiProvider.js";
import { OpenAIProvider } from "./openaiProvider.js";
import { DeterministicProvider } from "./deterministicProvider.js";

import { OrchestratorProvider } from "./orchestratorProvider.js";
import { OpenRouterProvider } from "./openRouterProvider.js";
import { OllamaProvider } from "./ollamaProvider.js";

export const getAIProvider = (): AIProvider => {
  const providers: { name: string; instance: AIProvider }[] = [];

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    providers.push({ name: "Gemini", instance: new GeminiProvider(geminiKey) });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    providers.push({ name: "OpenRouter", instance: new OpenRouterProvider(openRouterKey) });
  }

  const ollamaUrl = process.env.OLLAMA_BASE_URL;
  if (ollamaUrl) {
    providers.push({ name: "Ollama", instance: new OllamaProvider(ollamaUrl) });
  }

  // Always append Deterministic as the ultimate fallback
  providers.push({ name: "Deterministic", instance: new DeterministicProvider() });

  return new OrchestratorProvider(providers);
};
