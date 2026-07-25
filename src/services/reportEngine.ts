import { DemoPortfolio } from "./demoPortfolio";
import { riskEngine } from "./riskEngine";
import { recommendationEngine } from "./recommendationEngine";

export class ReportEngine {
  generateReport(portfolio: DemoPortfolio) {
    const risk = riskEngine.analyzeRisk(portfolio);
    const recs = recommendationEngine.generateRecommendations(portfolio);

    return {
      date: new Date().toLocaleDateString(),
      executiveSummary: `This enterprise report provides a comprehensive overview of the ${portfolio.persona} portfolio currently valued at $${portfolio.totalValueUsd.toLocaleString()}. The portfolio exhibits a ${risk.riskLevel.toLowerCase()} risk profile with an overall health score of 84/100.`,
      metrics: {
        totalValue: portfolio.totalValueUsd,
        riskScore: risk.overallRiskScore,
        riskLevel: risk.riskLevel,
        activeAssets: portfolio.assets.length
      },
      assetAllocation: portfolio.assets.map(a => ({
        symbol: a.symbol,
        allocation: a.allocationPct,
        value: a.valueUsd
      })),
      topRecommendations: recs.slice(0, 3)
    };
  }
}

export const reportEngine = new ReportEngine();
