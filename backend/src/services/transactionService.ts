import { prisma } from "../prisma";

export class TransactionService {
  prepareTransaction(intentId: string, quoteResponse: any, walletAddress: string) {
    // In a real application, this calls Jupiter's /v6/swap endpoint to get the base64 swap transaction.
    return {
      intentId,
      status: "prepared",
      message: "Ready for client signature."
    };
  }

  async saveTransactionResult(intentId: string, signature: string, status: string) {
    const intent = await prisma.intent.findUnique({ where: { id: intentId } });
    if (!intent) return null;
    
    return await prisma.transaction.create({
      data: {
        userId: intent.userId,
        signature,
        type: "swap",
        status,
        fromToken: "SOL", // Temporary placeholder
      }
    });
  }

  async getTransaction(signature: string) {
    return await prisma.transaction.findUnique({ where: { signature } });
  }
}

export const transactionService = new TransactionService();
