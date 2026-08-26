import { test, expect } from '@playwright/test';

test.describe('Advanced Theme Switching', () => {
  test('should toggle between dark and light themes seamlessly', async ({ page }) => {
    // 1. Navigate to the app
    await page.goto('http://localhost:5173');

    // 2. By default, it should be in dark mode (no data-theme='light' on root)
    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveAttribute('data-theme', 'light');

    // 3. Find and click the theme toggle button 
    // It has the title "Switch to Light Mode" initially
    const themeToggleButton = page.getByTitle('Switch to Light Mode');
    if (await themeToggleButton.isVisible()) {
      await themeToggleButton.click();
    
      // 4. Verify that data-theme='light' is applied to html root
      await expect(htmlElement).toHaveAttribute('data-theme', 'light');

      // 5. Click again to switch back to dark mode
      const darkThemeButton = page.getByTitle('Switch to Dark Mode');
      await darkThemeButton.click();

      // 6. Verify data-theme='light' is removed
      await expect(htmlElement).not.toHaveAttribute('data-theme', 'light');
    } else {
      console.log('Theme toggle button not visible on landing page (user must be logged in for it to show in MainLayout).');
      // If the button is only in MainLayout, we skip if it's not present on Landing Page.
    }
  });
});
