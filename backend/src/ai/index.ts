import { AIProvider } from "./aiProvider.js";
import { OpenAIProvider } from "./openaiProvider.js";
import { DeterministicProvider } from "./deterministicProvider.js";

export const getAIProvider = (): AIProvider => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    return new OpenAIProvider(apiKey);
  }
  console.warn("No OPENAI_API_KEY found. Falling back to Deterministic AI Provider.");
  return new DeterministicProvider();
};
