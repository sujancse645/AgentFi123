export function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${clampPercentage(value).toFixed(decimals)}%`;
}
