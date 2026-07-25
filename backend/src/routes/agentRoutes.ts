import { Router, Request, Response } from "express";
import { agentEngine } from "../agents/agentEngine";

const router = Router();

router.get("/state", (req: Request, res: Response) => {
  res.json(agentEngine.getState());
});

router.get("/activity", (req: Request, res: Response) => {
  res.json(agentEngine.getActivity());
});

router.get("/stream", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send initial state immediately
  res.write(`data: ${JSON.stringify({ type: "state", data: agentEngine.getState() })}\n\n`);

  const onStateUpdate = (state: any) => {
    res.write(`data: ${JSON.stringify({ type: "state", data: state })}\n\n`);
  };

  const onActivityUpdate = (activity: any) => {
    res.write(`data: ${JSON.stringify({ type: "activity", data: activity })}\n\n`);
  };

  agentEngine.on("state_update", onStateUpdate);
  agentEngine.on("activity_update", onActivityUpdate);

  req.on("close", () => {
    agentEngine.removeListener("state_update", onStateUpdate);
    agentEngine.removeListener("activity_update", onActivityUpdate);
  });
});

export default router;
