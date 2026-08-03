import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "agentfi-super-secret-key-12345";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    wallet: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; wallet: string };
    
    // Verify session exists in DB
    const session = await prisma.session.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Session expired or invalid" });
    }

    req.user = {
      id: decoded.userId,
      wallet: decoded.wallet
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
