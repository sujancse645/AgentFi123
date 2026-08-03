import { Router, Request, Response } from "express";
import { prisma } from "../prisma.js";
import jwt from "jsonwebtoken";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "agentfi-super-secret-key-12345";

router.post("/nonce", async (req: Request, res: Response) => {
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: "Wallet address is required" });

  try {
    const nonce = `Sign this message for AgentFi authentication: ${Math.random().toString(36).substring(2, 15)}`;
    
    await prisma.user.upsert({
      where: { wallet },
      update: { nonce },
      create: { wallet, nonce }
    });

    res.json({ nonce });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify", async (req: Request, res: Response) => {
  const { wallet, signature } = req.body;
  if (!wallet || !signature) return res.status(400).json({ error: "Wallet and signature required" });

  try {
    const user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) return res.status(404).json({ error: "User not found. Request a nonce first." });

    const messageBytes = new TextEncoder().encode(user.nonce);
    const signatureBytes = Buffer.from(signature, "base64");
    const publicKeyBytes = new PublicKey(wallet).toBytes();

    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    
    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const token = jwt.sign({ userId: user.id, wallet: user.wallet }, JWT_SECRET, { expiresIn: "24h" });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    res.json({ token, user: { id: user.id, wallet: user.wallet } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
