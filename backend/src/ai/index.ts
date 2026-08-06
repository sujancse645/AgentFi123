import { AIProvider } from "./aiProvider.js";
import { GeminiProvider } from "./geminiProvider.js";
import { OpenAIProvider } from "./openaiProvider.js";
import { DeterministicProvider } from "./deterministicProvider.js";

export const getAIProvider = (): AIProvider => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
  }
  return new GeminiProvider(geminiKey);
};
