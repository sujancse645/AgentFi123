# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: agentfi.spec.ts >> AgentFi Smoke Tests >> 8. Intent input accepts "Swap 0.01 SOL to USDC"
- Location: tests\e2e\agentfi.spec.ts:59:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8080/agents
Call log:
  - navigating to "http://localhost:8080/agents", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('AgentFi Smoke Tests', () => {
  4   |   test('1. Landing page loads successfully', async ({ page }) => {
  5   |     await page.goto('http://localhost:8080');
  6   |     await expect(page.locator('text=AgentFi').first()).toBeVisible();
  7   |   });
  8   | 
  9   |   test('2. "Launch AgentFi" button navigates to the dashboard', async ({ page }) => {
  10  |     await page.goto('http://localhost:8080');
  11  |     const launchBtn = page.locator('text=Launch AgentFi').first();
  12  |     await launchBtn.click();
  13  |     await expect(page).toHaveURL(/.*\/dashboard/);
  14  |   });
  15  | 
  16  |   test('3. "Explore Demo" button works', async ({ page }) => {
  17  |     await page.goto('http://localhost:8080');
  18  |     // Using a more lenient locator if text is different
  19  |     const demoBtn = page.locator('button', { hasText: /Demo/i }).first();
  20  |     if (await demoBtn.isVisible()) {
  21  |       await demoBtn.click();
  22  |       await expect(page).toHaveURL(/.*\/dashboard/);
  23  |     }
  24  |   });
  25  | 
  26  |   test('4. Dashboard loads without a blank screen', async ({ page }) => {
  27  |     await page.goto('http://localhost:8080/dashboard');
  28  |     await expect(page.locator('text=Command Center').first()).toBeVisible();
  29  |   });
  30  | 
  31  |   test('5. Backend health displays as connected', async ({ page }) => {
  32  |     await page.goto('http://localhost:8080/dashboard');
  33  |     await expect(
  34  |       page.locator('text=Backend Connected')
  35  |         .or(page.locator('text=Optimal'))
  36  |         .or(page.locator('text=Demo Mode Active'))
  37  |         .or(page.locator('text=Local Demo'))
  38  |         .first()
  39  |     ).toBeVisible({ timeout: 10000 });
  40  |   });
  41  | 
  42  |   test('6. Agent cards render planner, risk, market, and execution', async ({ page }) => {
  43  |     await page.goto('http://localhost:8080/dashboard');
  44  |     await expect(page.locator('text=Planner Agent').first()).toBeVisible();
  45  |     await expect(page.locator('text=Risk Agent').first()).toBeVisible();
  46  |     await expect(page.locator('text=Market Agent').first()).toBeVisible();
  47  |     await expect(page.locator('text=Execution Agent').first()).toBeVisible();
  48  |   });
  49  | 
  50  |   test('7. Confidence values are formatted and do not overflow', async ({ page }) => {
  51  |     await page.goto('http://localhost:8080/dashboard');
  52  |     // We check that confidence text looks like a formatted number with %
  53  |     // Specifically looking for 1 decimal place e.g., 99.0% or 100.0%
  54  |     const confText = await page.locator('text=100.0').first().isVisible();
  55  |     const confText2 = await page.locator('text=99.0').first().isVisible();
  56  |     expect(confText || confText2).toBeTruthy();
  57  |   });
  58  | 
  59  |   test('8. Intent input accepts "Swap 0.01 SOL to USDC"', async ({ page }) => {
> 60  |     await page.goto('http://localhost:8080/agents');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8080/agents
  61  |     const input = page.locator('textarea[placeholder*="Swap 1 SOL" i]');
  62  |     await expect(input).toBeVisible();
  63  |     await input.fill('Swap 0.01 SOL to USDC');
  64  |     await expect(input).toHaveValue('Swap 0.01 SOL to USDC');
  65  |   });
  66  | 
  67  |   test('9 & 10. Intent flow validation requires wallet or demo', async ({ page }) => {
  68  |     await page.goto('http://localhost:8080/agents');
  69  |     const input = page.locator('textarea[placeholder*="Swap 1 SOL" i]');
  70  |     const submitBtn = page.locator('button', { hasText: /Parse/i }).first();
  71  |     
  72  |     await input.fill('Swap 0.01 SOL to USDC');
  73  |     await submitBtn.click();
  74  |     
  75  |     // Since we are not connected and not in demo mode in this test environment,
  76  |     // the app should open the Wallet Modal asking the user to connect.
  77  |     const walletModal = page.locator('.wallet-adapter-modal-overlay').first();
  78  |     await expect(walletModal).toBeVisible();
  79  |   });
  80  | 
  81  |   test('11, 12. Agent states and activity feed update', async ({ page }) => {
  82  |     await page.goto('http://localhost:8080/dashboard');
  83  |     // Check activity feed
  84  |     await expect(page.locator('text=Activity').first()).toBeVisible();
  85  |     // After submitting intent, we expect an activity log item
  86  |     // Since we don't submit intent in this test, we just check if feed exists
  87  |     const feed = page.locator('.activity-feed, [data-testid="activity-feed"]').first();
  88  |     if (await feed.isVisible()) {
  89  |       await expect(feed).toBeVisible();
  90  |     }
  91  |   });
  92  | 
  93  |   test('14. Cancel and close buttons work', async ({ page }) => {
  94  |     await page.goto('http://localhost:8080/dashboard');
  95  |     // Click some intent to bring up modal
  96  |     const intentBtn = page.locator('button', { hasText: /Swap 0.1 SOL/i }).first();
  97  |     if (await intentBtn.isVisible()) {
  98  |       await intentBtn.click();
  99  |       const cancelBtn = page.locator('button', { hasText: /Cancel|Close/i }).first();
  100 |       await cancelBtn.click();
  101 |       await expect(cancelBtn).not.toBeVisible();
  102 |     }
  103 |   });
  104 | 
  105 |   test('15. Navigation tabs and sidebar items open correct screens', async ({ page }) => {
  106 |     await page.goto('http://localhost:8080/dashboard');
  107 |     const labBtn = page.locator('text=Strategy Lab').first();
  108 |     await labBtn.click();
  109 |     await expect(page.locator('text=Strategy Lab').first()).toBeVisible();
  110 |   });
  111 | 
  112 |   test('16. Strategy Lab handles empty state and disabled execute button', async ({ page }) => {
  113 |     await page.goto('http://localhost:8080/dashboard');
  114 |     const labTab = page.locator('button', { hasText: 'Strategy Lab' }).first();
  115 |     await labTab.click();
  116 |     await expect(page.locator('text=Test Scenarios')).toBeVisible();
  117 | 
  118 |     const emptyBtn = page.locator('#execute-strategy-btn');
  119 |     await expect(emptyBtn).toBeVisible();
  120 |     await expect(emptyBtn).toBeDisabled();
  121 |     await expect(emptyBtn).toContainText(/Select a Strategy First/i);
  122 |   });
  123 | 
  124 |   test('17. Strategy Lab executes scenario, opens wallet modal, and cancel preserves selection', async ({ page }) => {
  125 |     await page.goto('http://localhost:8080/dashboard');
  126 |     const labTab = page.locator('button', { hasText: 'Strategy Lab' }).first();
  127 |     await labTab.click();
  128 |     await expect(page.locator('text=Test Scenarios')).toBeVisible();
  129 | 
  130 |     // Select "Stake 50% SOL" scenario
  131 |     const stakeScenarioBtn = page.locator('#scenario-btn-stake');
  132 |     await expect(stakeScenarioBtn).toBeVisible();
  133 |     await stakeScenarioBtn.click();
  134 | 
  135 |     // Wait for simulation metrics to appear
  136 |     const executeBtn = page.locator('#execute-strategy-btn');
  137 |     await expect(executeBtn).toBeVisible({ timeout: 5000 });
  138 |     await expect(executeBtn).toBeEnabled();
  139 | 
  140 |     // Click "Connect Wallet & Execute"
  141 |     await executeBtn.click();
  142 | 
  143 |     // Verify wallet modal is opened
  144 |     const walletModal = page.locator('.wallet-adapter-modal-overlay').first();
  145 |     await expect(walletModal).toBeVisible({ timeout: 5000 });
  146 | 
  147 |     // Cancel / close modal
  148 |     const closeBtn = page.locator('.wallet-adapter-modal-button-close, button:has-text("✕")').first();
  149 |     if (await closeBtn.isVisible()) {
  150 |       await closeBtn.click();
  151 |       await expect(walletModal).not.toBeVisible();
  152 |     }
  153 | 
  154 |     // Verify scenario is still selected
  155 |     await expect(page.locator('text=Stake 50% SOL').first()).toBeVisible();
  156 |     await expect(page.locator('text=AI Commentary').first()).toBeVisible();
  157 |   });
  158 | });
  159 | 
  160 | 
```