import { Router, Request, Response } from "express";
import { z } from "zod";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAIProvider } from "../ai/index.js";
import { agentEngine } from "../agents/agentEngine.js";

const router = Router();

const copilotChatSchema = z.object({
  message: z.string().min(1).max(1000),
  walletAddress: z.string().optional(),
});

const getSolanaConnection = () => {
  const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
  return new Connection(rpcUrl, "confirmed");
};

// Fetch current Jupiter price context
const getMarketContext = async (query: string): Promise<{ text: string; source: string; timestamp: string } | null> => {
  try {
    const isPrice = query.includes("price") || query.includes("quote");
    if (!isPrice) return null;

    // Basic heuristic to find token
    let token = "SOL";
    if (query.toUpperCase().includes("JUP")) token = "JUP";
    else if (query.toUpperCase().includes("BONK")) token = "BONK";
    else if (query.toUpperCase().includes("USDC")) token = "USDC";
    else {
      // If asking for a token we don't recognize, return unavailable
      const match = query.match(/price of (\w+)/i);
      if (match && !["SOL", "JUP", "BONK", "USDC"].includes(match[1].toUpperCase())) {
        return { text: "Live market data is currently unavailable.", source: "Jupiter Price V3", timestamp: new Date().toISOString() };
      }
    }

    const priceApi = process.env.JUPITER_PRICE_API_URL || "https://api.jup.ag/price/v3";
    const apiKey = process.env.JUPITER_API_KEY;
    
    const mints: Record<string, string> = {
      "SOL": "So11111111111111111111111111111111111111112",
      "BONK": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      "JUP": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      "USDC": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    };
    
    const mintId = mints[token];
    if (!mintId) {
      return { text: "Live market data is currently unavailable.", source: "Jupiter Price API", timestamp: new Date().toISOString() };
    }

    const headers: Record<string, string> = {};
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    const res = await fetch(`${priceApi}?ids=${mintId}`, { headers });
    if (!res.ok) throw new Error("Price fetch failed");
    const data = await res.json();
    
    const priceInfo = data.data[mintId];
    const timestamp = new Date().toISOString();
    if (priceInfo && priceInfo.price) {
      return { 
        text: `Live market data retrieved at ${timestamp}: ${token} price is $${priceInfo.price} USD.`,
        source: "Jupiter Price V3",
        timestamp
      };
    }
    return { text: "Live market data is currently unavailable.", source: "Jupiter Price V3", timestamp };
  } catch (err) {
    console.error("Market context error:", err);
    return { text: "Live market data is currently unavailable.", source: "Jupiter Price V3", timestamp: new Date().toISOString() };
  }
};

const getWalletContext = async (query: string, walletAddress?: string): Promise<{ text: string; source: string; timestamp: string } | null> => {
  if (!walletAddress) return null;
  const t = query.toLowerCase();
  if (!t.includes("balance") && !t.includes("wallet")) return null;

  const timestamp = new Date().toISOString();
  try {
    const pubKey = new PublicKey(walletAddress);
    const connection = getSolanaConnection();
    const balanceLamports = await connection.getBalance(pubKey);
    const balanceSol = balanceLamports / LAMPORTS_PER_SOL;
    
    return {
      text: `Live wallet data retrieved at ${timestamp} via ${connection.rpcEndpoint}: The connected wallet (${walletAddress}) has a balance of ${balanceSol} SOL.`,
      source: "Solana RPC",
      timestamp
    };
  } catch (err: any) {
    console.error("Wallet context error:", err);
    return { text: `Could not fetch live wallet balance: ${err.message}`, source: "Solana RPC", timestamp };
  }
};

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, walletAddress } = copilotChatSchema.parse(req.body);

    const t = message.toLowerCase();
    
    // Check for news
    if (t.includes("news")) {
      return res.json({
        answer: "Live news is unavailable unless a trusted news source is integrated.",
        provider: "deterministic",
        model: "fallback",
        dataSource: "None",
        dataTimestamp: new Date().toISOString(),
        isFallback: true
      });
    }

    // Fast fake data for predefined demo prompts to prevent Vercel timeouts
    const demoPrompts: Record<string, string> = {
      "why is my risk score high?": "Your risk score is currently elevated because a significant portion of your portfolio is concentrated in high-volatility assets. To lower your risk, consider diversifying into stablecoins or staking your SOL.",
      "what should i do with idle sol?": "You have idle SOL that could be generating yield. I recommend staking it natively or depositing it into a liquid staking protocol (like Jito or Marinade) to earn ~7-8% APY while maintaining liquidity.",
      "how can i increase yield?": "To increase your overall yield, you can provide liquidity in SOL/USDC pools on Raydium or Orca, or explore delta-neutral yield strategies. Would you like me to prepare a transaction to deploy capital into a stable yield farm?",
      "rebalance my portfolio": "I can help rebalance your portfolio to your target 60/40 allocation. This will involve swapping some of your highly appreciated altcoins back into SOL and USDC. Shall I simulate this rebalancing execution?"
    };

    if (demoPrompts[t]) {
      // Small simulated delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json({
        answer: demoPrompts[t],
        provider: "deterministic",
        model: "demo-fast",
        dataSource: "AgentFi Demo Engine",
        dataTimestamp: new Date().toISOString(),
        isFallback: true
      });
    }

    const contextParts: string[] = [];
    const sources: string[] = [];
    let latestTimestamp = new Date().toISOString();

    const marketCtx = await getMarketContext(message);
    if (marketCtx) {
      contextParts.push(marketCtx.text);
      sources.push(marketCtx.source);
      latestTimestamp = marketCtx.timestamp;
    }
    
    const walletCtx = await getWalletContext(message, walletAddress);
    if (walletCtx) {
      contextParts.push(walletCtx.text);
      sources.push(walletCtx.source);
      latestTimestamp = walletCtx.timestamp;
    }

    const context = contextParts.length > 0 ? contextParts.join("\n") : undefined;
    const dataSource = sources.length > 0 ? sources.join(" | ") : "None";

    const provider = getAIProvider();
    
    // Log Agent activity safely
    await agentEngine.updateAgent("planner", { 
      status: "working", 
      message: `Copilot analyzing query from ${walletAddress ? walletAddress.substring(0,6) : 'anonymous'}...` 
    });

    const response = await provider.generateAnswer({
      question: message,
      context,
    });

    await agentEngine.updateAgent("planner", { 
      status: "completed", 
      message: "Copilot response generated successfully." 
    });

    res.json({
      answer: response.answer,
      provider: response.provider,
      model: response.model,
      dataSource,
      dataTimestamp: latestTimestamp,
      isFallback: response.provider === "deterministic"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    
    console.error("Copilot chat error:", error);
    
    // Graceful deterministic fallback on severe error
    res.json({
      answer: "I am experiencing technical difficulties and cannot reach the AI provider right now. Please try again later.",
      provider: "deterministic",
      model: "fallback",
      dataSource: "None",
      dataTimestamp: new Date().toISOString(),
      isFallback: true
    });
  }
});

export default router;
