export interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  allocationPct: number;
  apy: number;
  isStaked: boolean;
  category: "major" | "stable" | "meme" | "defi";
}

export interface DemoPortfolio {
  persona: string;
  totalValueUsd: number;
  walletAgeDays: number;
  totalTransactions: number;
  assets: PortfolioAsset[];
  history: {
    timestamp: number;
    type: "swap" | "stake" | "deposit";
    description: string;
    valueUsd: number;
  }[];
}

export type PersonaType = "conservative" | "defi_farmer" | "whale" | "beginner";

export class DemoPortfolioService {
  private activePersona: PersonaType = "whale";

  setPersona(persona: PersonaType) {
    this.activePersona = persona;
  }

  getPersona(): PersonaType {
    return this.activePersona;
  }

  getPortfolio(): DemoPortfolio {
    if (this.activePersona === "conservative") {
      return {
        persona: "Conservative Investor",
        totalValueUsd: 15400.00,
        walletAgeDays: 620,
        totalTransactions: 42,
        assets: [
          { symbol: "USDC", name: "USD Coin", balance: 12000, valueUsd: 12000.00, allocationPct: 78, apy: 4.5, isStaked: true, category: "stable" },
          { symbol: "SOL", name: "Solana", balance: 23.4, valueUsd: 3400.00, allocationPct: 22, apy: 7.2, isStaked: true, category: "major" }
        ],
        history: [
          { timestamp: Date.now() - 86400000 * 5, type: "deposit", description: "Deposited USDC to Kamino", valueUsd: 5000.00 },
          { timestamp: Date.now() - 86400000 * 15, type: "stake", description: "Staked SOL natively", valueUsd: 3400.00 },
        ]
      };
    }

    if (this.activePersona === "defi_farmer") {
      return {
        persona: "DeFi Farmer",
        totalValueUsd: 42500.00,
        walletAgeDays: 310,
        totalTransactions: 1450,
        assets: [
          { symbol: "JUP", name: "Jupiter", balance: 12000, valueUsd: 13200.00, allocationPct: 31, apy: 12.5, isStaked: true, category: "defi" },
          { symbol: "JTO", name: "Jito", balance: 1500, valueUsd: 4500.00, allocationPct: 10, apy: 8.2, isStaked: true, category: "defi" },
          { symbol: "SOL", name: "Solana", balance: 100, valueUsd: 14500.00, allocationPct: 34, apy: 0, isStaked: false, category: "major" },
          { symbol: "USDC", name: "USD Coin", balance: 10300, valueUsd: 10300.00, allocationPct: 25, apy: 0, isStaked: false, category: "stable" }
        ],
        history: [
          { timestamp: Date.now() - 86400000 * 1, type: "swap", description: "Swapped SOL for JTO", valueUsd: 1200.00 },
          { timestamp: Date.now() - 86400000 * 2, type: "deposit", description: "Provided liquidity SOL-USDC", valueUsd: 4500.00 },
        ]
      };
    }

    if (this.activePersona === "whale") {
      return {
        persona: "Whale Investor",
        totalValueUsd: 2450000.00,
        walletAgeDays: 890,
        totalTransactions: 340,
        assets: [
          { symbol: "SOL", name: "Solana", balance: 12000, valueUsd: 1740000.00, allocationPct: 71, apy: 0, isStaked: false, category: "major" },
          { symbol: "USDC", name: "USD Coin", balance: 650000, valueUsd: 650000.00, allocationPct: 26, apy: 0, isStaked: false, category: "stable" },
          { symbol: "BONK", name: "Bonk", balance: 3000000000, valueUsd: 60000.00, allocationPct: 3, apy: 0, isStaked: false, category: "meme" }
        ],
        history: [
          { timestamp: Date.now() - 86400000 * 2, type: "swap", description: "Swapped USDC for SOL", valueUsd: 250000.00 },
          { timestamp: Date.now() - 86400000 * 12, type: "swap", description: "Swapped SOL for BONK", valueUsd: 60000.00 },
        ]
      };
    }

    // beginner
    return {
      persona: "Beginner",
      totalValueUsd: 850.00,
      walletAgeDays: 12,
      totalTransactions: 4,
      assets: [
        { symbol: "SOL", name: "Solana", balance: 5.8, valueUsd: 841.00, allocationPct: 99, apy: 0, isStaked: false, category: "major" },
        { symbol: "USDC", name: "USD Coin", balance: 9.00, valueUsd: 9.00, allocationPct: 1, apy: 0, isStaked: false, category: "stable" }
      ],
      history: [
        { timestamp: Date.now() - 86400000 * 10, type: "deposit", description: "Initial funding", valueUsd: 850.00 },
      ]
    };
  }
}

export const demoPortfolio = new DemoPortfolioService();
