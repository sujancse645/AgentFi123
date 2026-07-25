import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import compression from "compression";
import crypto from "crypto";
import agentRoutes from "./routes/agentRoutes";
import walletRoutes from "./routes/walletRoutes";
import intentRoutes from "./routes/intentRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:8080",
  credentials: true
}));
app.use(express.json());

// Request IDs
app.use((req: Request, res: Response, next: NextFunction) => {
  req.headers["x-request-id"] = req.headers["x-request-id"] || crypto.randomUUID();
  next();
});

app.use(morgan("dev"));

// Routes
app.use("/api/agents", agentRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/intents", intentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);

// Health Endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "agentfi-backend",
    timestamp: new Date().toISOString(),
    version: "1.0",
    uptime: process.uptime()
  });
});

// Metrics Endpoint
app.get("/api/metrics", (req: Request, res: Response) => {
  res.json({
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    uptime: process.uptime()
  });
});

// Central Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Central Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500
    }
  });
});

export default app;
