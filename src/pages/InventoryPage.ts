import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  get productsTitle() {
    return this.page.getByTestId('title');
  }
}
