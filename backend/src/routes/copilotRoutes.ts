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
const getMarketContext = async (query: string): Promise<string> => {
  try {
    const isPrice = query.includes("price");
    if (!isPrice) return "";

    // Parse tokens (naive approach for demonstration, defaults to SOL)
    let token = "SOL";
    if (query.toUpperCase().includes("JUP")) token = "JUP";
    if (query.toUpperCase().includes("BONK")) token = "BONK";

    const priceApi = process.env.JUPITER_PRICE_URL || "https://api.jup.ag/price/v2";
    // We just look up a commonly known mint or assume they mean SOL for simplicity,
    // A robust version would map tokens to mints. Here we just try SOL -> USDC
    const solMint = "So11111111111111111111111111111111111111112";
    const bonkMint = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
    const jupMint = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";
    
    let mintId = solMint;
    if (token === "BONK") mintId = bonkMint;
    if (token === "JUP") mintId = jupMint;

    const res = await fetch(`${priceApi}?ids=${mintId}`);
    if (!res.ok) throw new Error("Price fetch failed");
    const data = await res.json();
    
    const priceInfo = data.data[mintId];
    if (priceInfo && priceInfo.price) {
      return `Live market data retrieved at ${new Date().toISOString()}: ${token} price is $${priceInfo.price} USD.`;
    }
    return "Live market data is currently unavailable.";
  } catch (err) {
    console.error("Market context error:", err);
    return "Live market data is currently unavailable.";
  }
};

const getWalletContext = async (query: string, walletAddress?: string): Promise<string> => {
  if (!walletAddress) return "";
  const t = query.toLowerCase();
  if (!t.includes("balance") && !t.includes("wallet")) return "";

  try {
    const pubKey = new PublicKey(walletAddress);
    const connection = getSolanaConnection();
    const balanceLamports = await connection.getBalance(pubKey);
    const balanceSol = balanceLamports / LAMPORTS_PER_SOL;
    
    return `Live wallet data retrieved at ${new Date().toISOString()} via ${connection.rpcEndpoint}: The connected wallet (${walletAddress}) has a balance of ${balanceSol} SOL.`;
  } catch (err: any) {
    console.error("Wallet context error:", err);
    return `Could not fetch live wallet balance: ${err.message}`;
  }
};

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, walletAddress } = copilotChatSchema.parse(req.body);

    const t = message.toLowerCase();
    let contextParts: string[] = [];

    if (t.includes("price") || t.includes("swap") || t.includes("quote")) {
      contextParts.push(await getMarketContext(message));
    }
    
    if (t.includes("balance") || t.includes("wallet")) {
      contextParts.push(await getWalletContext(message, walletAddress));
    }

    const context = contextParts.filter(Boolean).join("\n");

    const provider = getAIProvider();
    
    // Log Agent activity safely
    await agentEngine.updateAgent("planner", { 
      status: "working", 
      message: `Copilot analyzing query from ${walletAddress ? walletAddress.substring(0,6) : 'anonymous'}...` 
    });

    const response = await provider.generateAnswer({
      question: message,
      context: context || undefined,
    });

    await agentEngine.updateAgent("planner", { 
      status: "completed", 
      message: "Copilot response generated successfully." 
    });

    res.json({
      answer: response.answer,
      provider: response.provider,
      model: response.model,
      isFallback: response.provider === "deterministic",
      timestamp: new Date().toISOString()
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
      isFallback: true,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
