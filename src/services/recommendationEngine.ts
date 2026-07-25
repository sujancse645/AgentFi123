import { DemoPortfolio, demoPortfolio } from "./demoPortfolio";
import { riskEngine } from "./riskEngine";

export interface Recommendation {
  id: string;
  type: string;
  title: string;
  confidence: number;
  expectedImpact: string;
  riskLevel: "Low" | "Medium" | "High";
  reasoning: string;
  observedData: string;
  analysis: string;
  expectedOutcome: string;
  actionText: string;
}

export class RecommendationEngine {
  generateRecommendations(portfolio?: DemoPortfolio): Recommendation[] {
    const pf = portfolio || demoPortfolio.getPortfolio();
    const risk = riskEngine.analyzeRisk(pf);

    const recs: Recommendation[] = [];

    const solAsset = pf.assets.find(a => a.symbol === "SOL");
    if (solAsset && solAsset.allocationPct > 50 && !solAsset.isStaked) {
      recs.push({
        id: "rec_stake_sol",
        type: "Yield Optimization",
        title: "Stake Idle SOL",
        confidence: 94,
        expectedImpact: "+7.4% APY",
        riskLevel: "Low",
        reasoning: "Idle assets detected. Staking SOL natively or via LSTs generates risk-free base yield.",
        observedData: `${solAsset.balance.toFixed(2)} unstaked SOL in wallet.`,
        analysis: "Portfolio is missing out on base network yield. Delegating to a validator or LST like JTO/mSOL is optimal.",
        expectedOutcome: "Immediate yield generation starting next epoch.",
        actionText: "Stake 50% SOL"
      });
    }

    if (risk.concentrationRisk > 70) {
      recs.push({
        id: "rec_rebalance",
        type: "Risk Management",
        title: "Rebalance Portfolio",
        confidence: 89,
        expectedImpact: "-12% Volatility",
        riskLevel: "Low",
        reasoning: "Portfolio lacks diversification. High concentration in single assets increases drawdown risk.",
        observedData: `72% concentration in Major assets (SOL).`,
        analysis: "Reducing SOL exposure by 10% into stables limits downside while maintaining upside exposure.",
        expectedOutcome: "More resilient portfolio during market corrections.",
        actionText: "Convert 10% SOL to USDC"
      });
    }

    recs.push({
      id: "rec_kamino",
      type: "Opportunity",
      title: "Supply USDC to Kamino",
      confidence: 88,
      expectedImpact: "+8.4% APY",
      riskLevel: "Medium",
      reasoning: "Stablecoin yields are elevated due to borrowing demand.",
      observedData: "4,500 USDC sitting idle.",
      analysis: "Kamino Finance currently offers 8.4% on USDC supply with low smart contract risk.",
      expectedOutcome: "Passive stablecoin yield.",
      actionText: "Supply USDC"
    });

    return recs;
  }
}

export const recommendationEngine = new RecommendationEngine();
