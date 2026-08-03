import { Router, Request, Response } from "express";
import { agentEngine } from "../agents/agentEngine.js";

const router = Router();

router.get("/state", async (req: Request, res: Response) => {
  try {
    const state = await agentEngine.getState();
    res.json(state);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/activity", async (req: Request, res: Response) => {
  try {
    const activity = await agentEngine.getActivity();
    res.json(activity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
