export class JupiterService {
  private readonly baseUrl = "https://quote-api.jup.ag/v6";

  async getQuote(inputMint: string, outputMint: string, amountStr: string, slippageBps: number = 50) {
    const url = `${this.baseUrl}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountStr}&slippageBps=${slippageBps}`;
    
    // Simple retry loop with timeout abort controller
    let retries = 2;
    while (retries > 0) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Jupiter API Error: ${res.status} - ${errorText}`);
        }
        return await res.json();
      } catch (e: any) {
        clearTimeout(timeout);
        retries--;
        if (retries === 0) throw new Error(`Jupiter Quote Failed: ${e.message}`);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  async simulateSwap(inputMint: string, outputMint: string, amount: string) {
    try {
      const quote = await this.getQuote(inputMint, outputMint, amount);
      if (!quote || !quote.routePlan || quote.routePlan.length === 0) {
        throw new Error("No route found for this swap pair.");
      }
      return {
        expectedOutput: quote.outAmount,
        priceImpact: quote.priceImpactPct,
        route: quote.routePlan,
        slippage: quote.slippageBps,
        networkFee: quote.networkFee,
        rawQuote: quote,
        risk: Number(quote.priceImpactPct) > 0.05 ? "high" : "low"
      };
    } catch (e: any) {
      throw new Error(`Simulation failed: ${e.message}`);
    }
  }
}

export const jupiterService = new JupiterService();
