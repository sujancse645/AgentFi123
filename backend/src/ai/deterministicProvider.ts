import { AIProvider, ParsedIntentResult, ParsedIntentSchema } from "./aiProvider";
import { agentEngine } from "../agents/agentEngine";

export class DeterministicProvider implements AIProvider {
  async parseIntent(text: string): Promise<ParsedIntentResult> {
    await agentEngine.updateAgent("planner", { status: "analyzing", message: "Deterministic: Parsing intent...", progress: 30 });
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        const t = text.toLowerCase();
        let targetToken = "USDC";
        if (t.includes("bonk")) targetToken = "BONK";
        if (t.includes("jup")) targetToken = "JUP";
        if (t.includes("wif")) targetToken = "WIF";
        
        let sourceToken = "SOL";
        if (t.includes("swap usdc")) sourceToken = "USDC";
        
        // Check for percentage e.g. "50%" or explicit amounts e.g. "1.25 SOL"
        let amount = 1;
        const explicitTokenMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:SOL|USDC|USDT|BONK|WIF|JUP|JTO|PYTH|RAY)\b/i);
        const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);

        if (explicitTokenMatch && !text.slice(0, explicitTokenMatch.index! + explicitTokenMatch[0].length).endsWith("%")) {
          amount = parseFloat(explicitTokenMatch[1]);
        } else if (percentMatch) {
          const pct = parseFloat(percentMatch[1]);
          const baseBalance = 2.5; // Default reference balance if none provided
          amount = +(baseBalance * (pct / 100)).toFixed(4);
        } else {
          const numMatch = text.match(/\d+(\.\d+)?/);
          amount = numMatch ? parseFloat(numMatch[0]) : 1;
        }

        await agentEngine.updateAgent("planner", { status: "completed", message: "Parsed intent successfully", progress: 100, confidence: 80 });
        const parsed = ParsedIntentSchema.parse({
          action: t.includes("stake") ? "stake" : "swap",
          amount,
          sourceToken,
          targetToken
        });
        resolve(parsed);
      }, 800); // Simulate network delay
    });
  }
}
