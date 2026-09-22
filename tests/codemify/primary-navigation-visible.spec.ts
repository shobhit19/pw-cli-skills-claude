// spec: specs/codemify-homepage.plan.md
// jira: KAN-4 (TC-CODEMIFY-002)
import { test, expect } from '../../src/fixtures/base';
import { CodemifyHomePage } from '../../src/pages/CodemifyHomePage';

test('primary navigation menu is visible on homepage @smoke', async ({ page }) => {
  const homePage = new CodemifyHomePage(page);

  // 1. Navigate to https://codemify.com/
  await homePage.goto();

  // expect: main navigation menu is visible
  await expect(homePage.navigation).toBeVisible();

  // expect: at least one navigation link is present
  expect(await homePage.navigationLinks.count()).toBeGreaterThan(0);
});
