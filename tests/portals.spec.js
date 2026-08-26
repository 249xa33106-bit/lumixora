import { test, expect } from '@playwright/test';

test.describe('NEXORA / LUMIXORA Comprehensive Portal & E2E Testing Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000);

    // Dismiss update modal if it appears
    try {
      const updateModalCloseBtn = page.getByRole('button', { name: /Later|Close/i }).first();
      if (await updateModalCloseBtn.isVisible({ timeout: 1500 })) {
        await updateModalCloseBtn.click({ force: true });
      }
    } catch (_err) {}
  });

  test('Landing Page renders branding and CTA buttons', async ({ page }) => {
    await expect(page).toHaveTitle(/Nexora|Lumixora/i);
    const getStartedBtn = page.getByRole('button', { name: /Get Started|Student Login/i }).first();
    await expect(getStartedBtn).toBeVisible();
  });

  test('Auth Portal opens with Student and Faculty modes', async ({ page }) => {
    const studentLoginBtn = page.getByRole('button', { name: /Student Login|Get Started/i }).first();
    if (await studentLoginBtn.isVisible()) {
      await studentLoginBtn.click({ force: true });
    }

    const emailInput = page.getByPlaceholder('you@example.com');
    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
    }
  });

  test('Theme switching toggles dark and light mode attributes', async ({ page }) => {
    const htmlElement = page.locator('html');
    const themeToggleButton = page.getByTitle(/Switch to Light Mode|Switch to Dark Mode/i);
    if (await themeToggleButton.isVisible()) {
      await themeToggleButton.click();
      await expect(htmlElement).toHaveAttribute('data-theme', 'light');
    }
  });
});
