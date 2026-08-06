import { AIProvider, ParsedIntentResult, ParsedIntentSchema } from "./aiProvider.js";
import { OpenAI } from "openai";
import { agentEngine } from "../agents/agentEngine.js";

export class OllamaProvider implements AIProvider {
  private openai: OpenAI;
  private readonly model = "llama3"; // standard generic Ollama local model name

  constructor(baseUrl: string) {
    // Ollama provides an OpenAI compatible endpoint at /v1
    const finalBaseUrl = baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/v1`;
    this.openai = new OpenAI({ 
      apiKey: "ollama", // API key is not required for local Ollama, but OpenAI client needs some string
      baseURL: finalBaseUrl,
    });
  }

  async parseIntent(text: string): Promise<ParsedIntentResult> {
    await agentEngine.updateAgent("planner", { status: "analyzing", message: "Ollama: Parsing intent...", progress: 30 });
    
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
      if (!responseText) throw new Error("Empty response from Ollama");

      const rawParsed = JSON.parse(responseText);
      const parsed = ParsedIntentSchema.parse(rawParsed);
      await agentEngine.updateAgent("planner", { status: "completed", message: "Parsed intent successfully", progress: 100, confidence: 85 });
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
        provider: "ollama",
        model: this.model
      };
    } catch (e: any) {
      console.error("Ollama Generation Error:", e);
      throw new Error(`Ollama failed: ${e.message}`);
    }
  }
}
