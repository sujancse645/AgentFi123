import { Router, Request, Response } from "express";
import { transactionService } from "../services/transactionService.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { wallet, demoSessionId, mode } = req.query;
  try {
    const txs = await transactionService.getTransactions(
      wallet as string,
      demoSessionId as string,
      mode as string
    );
    res.json(txs);
  } catch (error) {
    console.error("Failed to fetch transactions", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.get("/:signature", async (req: Request, res: Response) => {
  const signature = req.params.signature as string;
  const tx = await transactionService.getTransaction(signature);
  if (tx) res.json(tx);
  else res.status(404).json({ error: "Transaction not found" });
});

export default router;
