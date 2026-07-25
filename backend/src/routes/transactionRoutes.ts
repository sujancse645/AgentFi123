import { Router, Request, Response } from "express";
import { transactionService } from "../services/transactionService";

const router = Router();

router.get("/:signature", async (req: Request, res: Response) => {
  const signature = req.params.signature as string;
  const tx = await transactionService.getTransaction(signature);
  if (tx) res.json(tx);
  else res.status(404).json({ error: "Transaction not found" });
});

export default router;
