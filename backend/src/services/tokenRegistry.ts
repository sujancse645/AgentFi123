export interface TokenInfo {
  ticker: string;
  name: string;
  mint: string;
  decimals: number;
}

export class TokenRegistry {
  private tokens: Map<string, TokenInfo> = new Map();

  constructor() {
    // Populate verified tokens
    this.addToken({ ticker: "SOL", name: "Solana", mint: "So11111111111111111111111111111111111111112", decimals: 9 });
    this.addToken({ ticker: "USDC", name: "USD Coin", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 });
    this.addToken({ ticker: "BONK", name: "Bonk", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", decimals: 5 });
    this.addToken({ ticker: "JUP", name: "Jupiter", mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", decimals: 6 });
    this.addToken({ ticker: "WIF", name: "Dogwifhat", mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", decimals: 6 });
  }

  addToken(token: TokenInfo) {
    this.tokens.set(token.ticker.toUpperCase(), token);
  }

  getTokenByTicker(ticker: string): TokenInfo | undefined {
    return this.tokens.get(ticker.toUpperCase());
  }
}

export const tokenRegistry = new TokenRegistry();
