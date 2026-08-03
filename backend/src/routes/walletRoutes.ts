import { Router, Request, Response } from "express";
import { solanaService } from "../services/solanaService.js";

const router = Router();

router.get("/:address", async (req: Request, res: Response) => {
  const address = req.params.address as string;
  try {
    const data = await solanaService.getWalletData(address);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
