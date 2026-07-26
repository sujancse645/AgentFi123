import { AIProvider, ParsedIntentResult, ParsedIntentSchema } from "./aiProvider";
import { OpenAI } from "openai";
import { agentEngine } from "../agents/agentEngine";

export class OpenAIProvider implements AIProvider {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async parseIntent(text: string): Promise<ParsedIntentResult> {
    await agentEngine.updateAgent("planner", { status: "analyzing", message: "OpenAI: Parsing intent...", progress: 30 });
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Extract intent. Respond in JSON with keys: action (string), amount (number), sourceToken (string ticker like SOL), targetToken (string ticker like BONK)." },
          { role: "user", content: text }
        ],
      });

      const responseText = completion.choices[0].message.content;
      if (!responseText) throw new Error("Empty response from OpenAI");

      const rawParsed = JSON.parse(responseText);
      const parsed = ParsedIntentSchema.parse(rawParsed);
      await agentEngine.updateAgent("planner", { status: "completed", message: "Parsed intent successfully", progress: 100, confidence: 95 });
      return parsed;
    } catch (e: any) {
      await agentEngine.updateAgent("planner", { status: "failed", message: `AI Parse Failed: ${e.message}` });
      throw e;
    }
  }
}
