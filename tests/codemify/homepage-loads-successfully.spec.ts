// spec: specs/codemify-homepage.plan.md
// jira: KAN-4 (TC-CODEMIFY-001)
import { test, expect } from '../../src/fixtures/base';

test('homepage loads successfully @smoke', async ({ page }) => {
  // 1. Navigate to https://codemify.com/
  const response = await page.goto('https://codemify.com/');

  // expect: page responds successfully (no error page)
  expect(response?.ok()).toBeTruthy();

  // expect: page title is non-empty
  await expect(page).toHaveTitle(/.+/);
});
