export interface HealthBreakdown {
  diversification: number;
  risk: number;
  liquidity: number;
  yieldEfficiency: number;
  activity: number;
}

export interface Recommendation {
  id: string;
  title: string;
  impact: number;
  confidence: number;
  reason: string;
}

export interface FinancialHealth {
  overallScore: number;
  status: "Excellent" | "Good" | "Moderate" | "Needs Attention";
  breakdown: HealthBreakdown;
  observations: string[];
  recommendations: Recommendation[];
  demoMode: boolean;
  walletData?: {
    ageDays: number;
    portfolioValue: number;
    assets: string[];
  };
}

export class FinancialHealthEngine {
  
  public analyzeWallet(publicKey: string | null): FinancialHealth {
    // If no public key or in demo mode, generate realistic demo data
    if (!publicKey) {
      return this.generateDemoData();
    }

    // In a real application, we would fetch on-chain data for the publicKey here.
    // For now, we simulate an analysis of a connected wallet.
    return this.generateDemoData(true); 
  }

  private generateDemoData(isConnected = false): FinancialHealth {
    const overallScore = 82;
    return {
      overallScore,
      status: this.getStatus(overallScore),
      breakdown: {
        diversification: 78,
        risk: 85,
        liquidity: 91,
        yieldEfficiency: 74,
        activity: 82,
      },
      observations: [
        "Portfolio is heavily concentrated in SOL.",
        "Liquidity position is strong with stablecoin reserves.",
        "Yield opportunities remain underutilized.",
        "Risk exposure remains within acceptable range."
      ],
      recommendations: [
        {
          id: "rec-1",
          title: "Increase diversification",
          impact: 7,
          confidence: 91,
          reason: "Current portfolio concentration exceeds target allocation."
        },
        {
          id: "rec-2",
          title: "Stake idle SOL",
          impact: 5,
          confidence: 88,
          reason: "Identified unstaked SOL missing out on ~7% APY."
        }
      ],
      demoMode: !isConnected,
      walletData: {
        ageDays: 412,
        portfolioValue: 4321.50,
        assets: ["SOL", "USDC", "JUP", "BONK"]
      }
    };
  }

  private getStatus(score: number) {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 60) return "Moderate";
    return "Needs Attention";
  }
}

export const financialHealthEngine = new FinancialHealthEngine();
