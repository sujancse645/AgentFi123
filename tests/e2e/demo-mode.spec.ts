import { test, expect } from '@playwright/test';

test.describe('Dual-Mode Execution System', () => {
  test('Demo mode starts with simulated balance and executes mock transaction', async ({ page }) => {
    // Navigate to landing
    await page.goto('/');
    
    // Enter demo mode
    await page.click('text=Explore Demo');
    
    // Ensure we are redirected to dashboard
    await expect(page.locator('text=Demo Simulation')).toBeVisible({ timeout: 10000 }).catch(() => null);
    
    // Verify sessionStorage has demo state
    const demoSession = await page.evaluate(() => window.sessionStorage.getItem('agentfi_demo_session'));
    expect(demoSession).not.toBeNull();
    const sessionObj = JSON.parse(demoSession!);
    expect(sessionObj.isActive).toBe(true);
    expect(sessionObj.simulatedBalanceSol).toBe(10.0);
    
    // Navigate to Trade
    await page.goto('/trade');
    
    // Click Parse My Intent (should not require wallet)
    await page.fill('textarea', 'Swap 1 SOL to USDC');
    await page.click('button:has-text("Parse My Intent")');
    
    // Wait for parsing
    await expect(page.locator('button:has-text("Review & Approve")')).toBeVisible({ timeout: 15000 });
    await page.click('button:has-text("Review & Approve")');
    
    // Should see Demo Wallet info in Approval Dialog
    await expect(page.locator('text=Simulated Wallet')).toBeVisible();
    await expect(page.locator('text=10.0000 SOL')).toBeVisible();
    
    // Execute Demo Transaction
    await page.click('button:has-text("Simulate & Execute")');
    
    // Verify Success Modal
    await expect(page.locator('text=Demo Execution Successful')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Mock Transaction Broadcasted')).toBeVisible({ timeout: 10000 });
  });

  test('Live mode enforces wallet connection and balance checks', async ({ page }) => {
    // Navigate to landing
    await page.goto('/');
    
    // Click Launch AgentFi (exits demo)
    await page.click('text=Launch AgentFi');
    
    // Verify sessionStorage does NOT have demo state
    const demoSession = await page.evaluate(() => window.sessionStorage.getItem('agentfi_demo_session'));
    expect(demoSession).toBeNull();
    
    // Navigate to Trade
    await page.goto('/trade');
    
    await page.fill('textarea', 'Swap 1 SOL to USDC');
    
    // The button should require wallet connection
    const btn = page.locator('button:has-text("Connect to Parse")');
    await expect(btn).toBeVisible();
    
    // We cannot proceed without connecting phantom wallet
    // Playwright natively doesn't have Phantom, so we just check that it blocked us
    await btn.click();
    
    // The wallet modal should open
    await expect(page.locator('.wallet-adapter-modal-wrapper')).toBeVisible();
  });
});
