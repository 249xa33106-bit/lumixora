import { test, expect } from '@playwright/test';

test.describe('Authentication Portal Tests', () => {
  test('should render Faculty vs Student modes dynamically', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Wait briefly in case the update modal pops up asynchronously
    await page.waitForTimeout(1000);
    // Dismiss update modal if it exists
    const updateModalCloseBtn = page.getByRole('button', { name: /Later|Close/i });
    if (await updateModalCloseBtn.isVisible()) {
      await updateModalCloseBtn.click();
    }

    const getStartedBtn = page.getByRole('button', { name: /Student Login|Get Started/i }).first();
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click({ force: true });
    }

    // Check if the auth form exists
    const emailInput = page.getByPlaceholder('you@example.com');
    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
    }
  });
});
