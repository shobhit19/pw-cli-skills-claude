import { test, expect } from '../../src/fixtures/base';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import users from '../data/users.json';

test('standard user can log in @smoke @critical', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const { username, password } = users.users.standard;

  await loginPage.goto();

  await loginPage.fillUsername(username);
  await expect(loginPage.usernameInput).toHaveValue(username);

  await loginPage.fillPassword(password);
  await expect(loginPage.passwordInput).toHaveValue(password);

  await loginPage.submit();

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventoryPage.productsTitle).toBeVisible();
});
