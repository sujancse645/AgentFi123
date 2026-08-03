import { Router, Request, Response } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const router = Router();
const prisma = new PrismaClient();

const executeDemoSchema = z.object({
  demoSessionId: z.string().min(1),
  intentId: z.string().min(1),
  intent: z.string().min(1),
  simulation: z.object({
    inputToken: z.string(),
    outputToken: z.string(),
    inputAmount: z.number(),
    estimatedOutput: z.number(),
    route: z.array(z.string()).optional()
  }).optional()
});

router.post("/execute", async (req: Request, res: Response) => {
  try {
    const validatedData = executeDemoSchema.parse(req.body);
    const { demoSessionId, intentId, intent, simulation } = validatedData;

    // Generate mock demo transaction ID
    const mockHash = crypto.randomBytes(3).toString("hex").toUpperCase();
    const demoTransactionId = `DEMO-AGENTFI-${Date.now()}-${mockHash}`;

    // Create a mock transaction in the database
    // We associate it with a dummy user for demo purposes if needed,
    let user = await prisma.user.findUnique({ where: { wallet: "DEMO_WALLET" } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          wallet: "DEMO_WALLET",
          nonce: crypto.randomBytes(16).toString("hex")
        }
      });
    }

    const tx = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "DEMO_SWAP",
        status: "SIMULATED",
        fromToken: simulation?.inputToken || "SOL",
        toToken: simulation?.outputToken || "USDC",
        fromAmount: simulation?.inputAmount || 0,
        toAmount: simulation?.estimatedOutput || 0,
        isDemo: true,
        executionMode: "demo",
        demoTransactionId,
        intent: intentId,
        route: simulation?.route ? JSON.stringify(simulation.route) : null,
      }
    });

    // Write Agent Events
    await prisma.agentActivityLog.create({
      data: {
        agent: "Execution",
        title: "Demo Transaction Confirmed",
        message: `Executed strictly along planned route (Mock ID: ${demoTransactionId})`,
        status: "success"
      }
    });

    res.json({
      success: true,
      isDemo: true,
      demoTransactionId,
      status: "simulated",
      inputToken: tx.fromToken,
      outputToken: tx.toToken,
      inputAmount: tx.fromAmount,
      estimatedOutput: tx.toAmount,
      route: simulation?.route || [],
      timestamp: tx.timestamp
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error("Demo execution error:", error);
    res.status(500).json({ error: "Failed to execute demo transaction" });
  }
});

export default router;
