-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "demoTransactionId" TEXT,
ADD COLUMN     "executionMode" TEXT NOT NULL DEFAULT 'live',
ADD COLUMN     "isDemo" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "signature" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_demoTransactionId_key" ON "Transaction"("demoTransactionId");
