// pages/BasePage.ts
import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(readonly page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }

  async waitForPage() {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle() {
    return this.page.title();
  }

  async expectUrl(path: string | RegExp) {
    await expect(this.page).toHaveURL(path);
  }

  locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}