import { DemoPortfolio, demoPortfolio } from "./demoPortfolio";

export interface RiskProfile {
  concentrationRisk: number; // 0-100
  volatilityRisk: number;
  liquidityRisk: number;
  protocolRisk: number;
  counterpartyRisk: number;
  overallRiskScore: number;
  riskLevel: "Low" | "Medium" | "High";
}

export class RiskEngine {
  analyzeRisk(portfolio?: DemoPortfolio): RiskProfile {
    const pf = portfolio || demoPortfolio.getPortfolio();
    
    // Simulate complex risk analysis based on portfolio
    const solExposure = pf.assets.find(a => a.symbol === "SOL")?.allocationPct || 0;
    const memeExposure = pf.assets.filter(a => a.category === "meme").reduce((acc, val) => acc + val.allocationPct, 0);
    const stableExposure = pf.assets.filter(a => a.category === "stable").reduce((acc, val) => acc + val.allocationPct, 0);

    const concentrationRisk = Math.min(100, solExposure * 1.2);
    const volatilityRisk = Math.min(100, 30 + memeExposure * 2 + (100 - stableExposure) * 0.4);
    const liquidityRisk = Math.max(0, 100 - stableExposure * 3);
    const protocolRisk = 25; // Base defi risk
    const counterpartyRisk = 15; // Low on-chain counterparty

    const overallRiskScore = Math.round(
      (concentrationRisk * 0.4) + 
      (volatilityRisk * 0.3) + 
      (liquidityRisk * 0.1) + 
      (protocolRisk * 0.1) + 
      (counterpartyRisk * 0.1)
    );

    let riskLevel: "Low" | "Medium" | "High" = "Medium";
    if (overallRiskScore < 40) riskLevel = "Low";
    if (overallRiskScore > 75) riskLevel = "High";

    return {
      concentrationRisk,
      volatilityRisk,
      liquidityRisk,
      protocolRisk,
      counterpartyRisk,
      overallRiskScore,
      riskLevel
    };
  }
}

export const riskEngine = new RiskEngine();
