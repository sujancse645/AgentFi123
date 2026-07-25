export interface QuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number; // in smallest units
  slippageBps?: number;
}

export class QuoteService {
  private readonly baseUrl = "https://quote-api.jup.ag/v6";

  async getQuote(params: QuoteParams): Promise<any> {
    try {
      const url = new URL(`${this.baseUrl}/quote`);
      url.searchParams.append("inputMint", params.inputMint);
      url.searchParams.append("outputMint", params.outputMint);
      url.searchParams.append("amount", params.amount.toString());
      if (params.slippageBps) {
        url.searchParams.append("slippageBps", params.slippageBps.toString());
      }

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Jupiter quote failed: ${res.statusText}`);
      }
      return await res.json();
    } catch (e) {
      console.error("QuoteService error:", e);
      throw e;
    }
  }
}

export const quoteService = new QuoteService();
