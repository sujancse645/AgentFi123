import { AIProvider, ParsedIntentResult, ParsedIntentSchema } from "./aiProvider.js";
import { GoogleGenAI } from "@google/genai";
import { agentEngine } from "../agents/agentEngine.js";

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI;
  private model = "gemini-2.5-flash";

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async parseIntent(text: string): Promise<ParsedIntentResult> {
    await agentEngine.updateAgent("planner", { status: "analyzing", message: "Gemini: Parsing intent...", progress: 30 });
    
    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: text,
        config: {
          systemInstruction: "Extract intent. Respond in JSON with keys: action (string), amount (number), sourceToken (string ticker like SOL), targetToken (string ticker like BONK).",
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Empty response from Gemini");

      const rawParsed = JSON.parse(responseText);
      const parsed = ParsedIntentSchema.parse(rawParsed);
      await agentEngine.updateAgent("planner", { status: "completed", message: "Parsed intent successfully", progress: 100, confidence: 95 });
      return parsed;
    } catch (e: any) {
      await agentEngine.updateAgent("planner", { status: "failed", message: `AI Parse Failed: ${e.message}` });
      throw e;
    }
  }

  async generateAnswer(input: { question: string; context?: string }): Promise<{ answer: string; provider: string; model: string }> {
    try {
      const systemContext = input.context 
        ? `Use the following live data context to answer the user's question accurately. Do not invent prices or balances. Context: ${input.context}`
        : "You are AgentFi's Financial Copilot. Answer user questions helpfully, concisely, and accurately.";

      const timeoutMs = 8000;
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
      );

      const requestPromise = this.ai.models.generateContent({
        model: this.model,
        contents: input.question,
        config: {
          systemInstruction: systemContext
        }
      });

      const response = await Promise.race([requestPromise, timeoutPromise]);

      return {
        answer: response.text || "No response generated.",
        provider: "gemini",
        model: this.model
      };
    } catch (e: any) {
      console.error("Gemini Generation Error:", e);
      throw new Error(`Gemini failed: ${e.message}`);
    }
  }
}
