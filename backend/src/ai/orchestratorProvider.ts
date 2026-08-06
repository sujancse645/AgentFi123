import { AIProvider, ParsedIntentResult } from "./aiProvider.js";

export class OrchestratorProvider implements AIProvider {
  private providers: { name: string; instance: AIProvider }[] = [];
  private readonly maxRetries = 2;
  private readonly timeoutMs = 15000;

  constructor(providers: { name: string; instance: AIProvider }[]) {
    this.providers = providers;
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number, providerName: string): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`Timeout of ${ms}ms exceeded for provider ${providerName}`)), ms);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId!);
    }
  }

  private async executeWithFallback<T>(
    operationName: string,
    operation: (provider: AIProvider) => Promise<T>
  ): Promise<T> {
    for (const { name, instance } of this.providers) {
      let attempts = 0;
      while (attempts <= this.maxRetries) {
        attempts++;
        try {
          // Attempt the operation
          return await this.withTimeout(operation(instance), this.timeoutMs, name);
        } catch (error: any) {
          console.error(`[Orchestrator] ${name} provider failed during '${operationName}'. Attempt ${attempts}/${this.maxRetries + 1}. Reason: ${error.message}`);
          if (attempts > this.maxRetries) {
            console.warn(`[Orchestrator] Exhausted retries for ${name}. Falling back to next provider...`);
            break; // Break the while loop to move to the next provider
          }
        }
      }
    }
    
    // If we exhaust all providers, we throw a critical error (though DeterministicProvider should never fail)
    throw new Error(`[Orchestrator] All AI providers exhausted for '${operationName}'.`);
  }

  async parseIntent(text: string): Promise<ParsedIntentResult> {
    return this.executeWithFallback("parseIntent", (provider) => provider.parseIntent(text));
  }

  async generateAnswer(input: { question: string; context?: string }): Promise<{ answer: string; provider: string; model: string }> {
    return this.executeWithFallback("generateAnswer", (provider) => provider.generateAnswer(input));
  }
}
