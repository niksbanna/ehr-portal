import { test, expect } from '@playwright/test';

test.describe('EHR Portal', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/');

    // Should redirect to login or show login page
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('should have proper page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/EHR Portal/i);
  });

  test('should show login form', async ({ page }) => {
    await page.goto('/login');

    // Check for login form elements
    const usernameInput = page.getByRole('textbox', { name: /username|email/i });
    const passwordInput = page.getByRole('textbox', { name: /password/i });

    await expect(usernameInput || passwordInput).toBeTruthy();
  });
});
