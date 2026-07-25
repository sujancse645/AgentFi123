import { AIProvider } from "./aiProvider";
import { OpenAIProvider } from "./openaiProvider";
import { DeterministicProvider } from "./deterministicProvider";

export const getAIProvider = (): AIProvider => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    return new OpenAIProvider(apiKey);
  }
  console.warn("No OPENAI_API_KEY found. Falling back to Deterministic AI Provider.");
  return new DeterministicProvider();
};
