import { describe, it, expect } from "vitest";
import { extractAmount, parseIntent } from "../lib/intentParser";

describe("Strategy Lab Amount & Percentage Calculation Logic", () => {
  it("calculates 50% staking amount for 2.5 SOL balance -> 1.25 SOL", async () => {
    const walletBalance = 2.5;
    const { amount, percentage, token } = extractAmount("Stake 50% SOL into high-yield staking protocol", walletBalance);
    expect(percentage).toBe(50);
    expect(amount).toBe(1.25);
    expect(token).toBe("SOL");

    const parsed = await parseIntent("Stake 50% SOL into high-yield staking protocol", { walletBalance });
    expect(parsed.source.amount).toBe(1.25);
    expect(parsed.walletContext?.balance).toBe(2.5);
    expect(parsed.walletContext?.percentage).toBe(50);
    expect(parsed.walletContext?.calculatedAmount).toBe(1.25);
    expect(parsed.walletContext?.hasSufficientBalance).toBe(true);
  });

  it("calculates 50% staking amount for 10 SOL balance -> 5.0 SOL", async () => {
    const walletBalance = 10;
    const { amount, percentage, token } = extractAmount("Stake 50% SOL", walletBalance);
    expect(percentage).toBe(50);
    expect(amount).toBe(5.0);
    expect(token).toBe("SOL");

    const parsed = await parseIntent("Stake 50% SOL", { walletBalance });
    expect(parsed.source.amount).toBe(5.0);
    expect(parsed.walletContext?.balance).toBe(10);
    expect(parsed.walletContext?.percentage).toBe(50);
    expect(parsed.walletContext?.calculatedAmount).toBe(5.0);
    expect(parsed.walletContext?.hasSufficientBalance).toBe(true);
  });

  it("calculates 50% staking amount for 0.8 SOL balance -> 0.4 SOL", async () => {
    const walletBalance = 0.8;
    const { amount, percentage, token } = extractAmount("Stake 50% SOL", walletBalance);
    expect(percentage).toBe(50);
    expect(amount).toBe(0.4);
    expect(token).toBe("SOL");

    const parsed = await parseIntent("Stake 50% SOL", { walletBalance });
    expect(parsed.source.amount).toBe(0.4);
    expect(parsed.walletContext?.balance).toBe(0.8);
    expect(parsed.walletContext?.percentage).toBe(50);
    expect(parsed.walletContext?.calculatedAmount).toBe(0.4);
    expect(parsed.walletContext?.hasSufficientBalance).toBe(true);
  });

  it("calculates 20% reallocation for 2.5 SOL balance -> 0.5 SOL", async () => {
    const walletBalance = 2.5;
    const { amount, percentage } = extractAmount("Move 20% into USDC", walletBalance);
    expect(percentage).toBe(20);
    expect(amount).toBe(0.5);
  });

  it("correctly flags zero balance wallets and disables execution", async () => {
    const walletBalance = 0;
    const parsed = await parseIntent("Stake 50% SOL", { walletBalance });
    expect(parsed.walletContext?.balance).toBe(0);
    expect(parsed.walletContext?.hasSufficientBalance).toBe(false);
    expect(parsed.meta?.reasoning).toContain("⚠️ Your wallet has no SOL available.");
  });

  it("extracts explicit amounts when formatted alongside percentages", async () => {
    const walletBalance = 2.5;
    const { amount, percentage } = extractAmount("Stake 1.25 SOL (50% of 2.5000 SOL)", walletBalance);
    expect(amount).toBe(1.25);
    expect(percentage).toBe(50);
  });
});
