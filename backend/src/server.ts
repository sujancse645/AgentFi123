import app from "./app.js";

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 AgentFi Backend running on port ${port}`);
});

export default server;
