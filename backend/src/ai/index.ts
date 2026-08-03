import { AIProvider } from "./aiProvider.js";
import { GeminiProvider } from "./geminiProvider.js";
import { OpenAIProvider } from "./openaiProvider.js";
import { DeterministicProvider } from "./deterministicProvider.js";

export const getAIProvider = (): AIProvider => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    return new GeminiProvider(geminiKey);
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return new OpenAIProvider(openaiKey);
  }

  console.warn("No GEMINI_API_KEY or OPENAI_API_KEY found. Falling back to Deterministic AI Provider.");
  return new DeterministicProvider();
};
