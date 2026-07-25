import { AIProvider, ParsedIntentResult, ParsedIntentSchema } from "./aiProvider";
import { agentEngine } from "../agents/agentEngine";

export class DeterministicProvider implements AIProvider {
  async parseIntent(text: string): Promise<ParsedIntentResult> {
    agentEngine.updateAgent("planner", { status: "analyzing", message: "Deterministic: Parsing intent...", progress: 30 });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const t = text.toLowerCase();
        let targetToken = "USDC";
        if (t.includes("bonk")) targetToken = "BONK";
        if (t.includes("jup")) targetToken = "JUP";
        if (t.includes("wif")) targetToken = "WIF";
        
        let sourceToken = "SOL";
        if (t.includes("swap usdc")) sourceToken = "USDC";
        
        const numMatch = text.match(/\d+(\.\d+)?/);
        const amount = numMatch ? parseFloat(numMatch[0]) : 1;

        agentEngine.updateAgent("planner", { status: "completed", message: "Parsed intent successfully", progress: 100, confidence: 80 });
        const parsed = ParsedIntentSchema.parse({
          action: "swap",
          amount,
          sourceToken,
          targetToken
        });
        resolve(parsed);
      }, 800); // Simulate network delay
    });
  }
}
