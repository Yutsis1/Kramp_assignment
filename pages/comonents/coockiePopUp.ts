import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './baseComponent';

export class CookiePopUp extends BaseComponent {
  readonly acceptAllCookiesButton: Locator;
  readonly cookieSettingsButton: Locator;

  constructor(page: Page) {
    super(page, page.locator('#onetrust-banner-sdk'));

    this.acceptAllCookiesButton = this.root.locator('#onetrust-accept-btn-handler');
    this.cookieSettingsButton = this.root.locator('#onetrust-pc-btn-handler');
  }

  async acceptAllCookies() {
    await this.acceptAllCookiesButton.click();
  }

  async openCookieSettings() {
    await this.cookieSettingsButton.click();
  }
}
