// components/BaseComponent.ts

import { expect, Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
  constructor(
    readonly page: Page,
    readonly root: Locator
  ) {}

  async expectVisible() {
    await expect(this.root).toBeVisible();
  }

  async expectHidden() {
    await expect(this.root).toBeHidden();
  }

  locator(selector: string): Locator {
    return this.root.locator(selector);
  }
}