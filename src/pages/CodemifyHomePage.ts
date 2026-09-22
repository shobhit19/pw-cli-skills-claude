import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CodemifyHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('https://codemify.com/');
  }

  get navigation() {
    return this.page.getByRole('navigation').first();
  }

  get navigationLinks() {
    return this.navigation.getByRole('link');
  }
}
