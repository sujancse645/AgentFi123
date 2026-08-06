import { AIProvider, ParsedIntentResult, ParsedIntentSchema } from "./aiProvider.js";
import { OpenAI } from "openai";
import { agentEngine } from "../agents/agentEngine.js";

export class OpenRouterProvider implements AIProvider {
  private openai: OpenAI;
  private readonly model = "meta-llama/llama-3.3-70b-instruct"; // OpenRouter recommended default

  constructor(apiKey: string) {
    this.openai = new OpenAI({ 
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }

  async parseIntent(text: string): Promise<ParsedIntentResult> {
    await agentEngine.updateAgent("planner", { status: "analyzing", message: "OpenRouter: Parsing intent...", progress: 30 });
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Extract intent. Respond in JSON with keys: action (string), amount (number), sourceToken (string ticker like SOL), targetToken (string ticker like BONK)." },
          { role: "user", content: text }
        ],
      });

      const responseText = completion.choices[0].message.content;
      if (!responseText) throw new Error("Empty response from OpenRouter");

      const rawParsed = JSON.parse(responseText);
      const parsed = ParsedIntentSchema.parse(rawParsed);
      await agentEngine.updateAgent("planner", { status: "completed", message: "Parsed intent successfully", progress: 100, confidence: 90 });
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

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: input.question }
        ]
      });

      return {
        answer: completion.choices[0].message.content || "No response generated.",
        provider: "openrouter",
        model: this.model
      };
    } catch (e: any) {
      console.error("OpenRouter Generation Error:", e);
      throw new Error(`OpenRouter failed: ${e.message}`);
    }
  }
}
