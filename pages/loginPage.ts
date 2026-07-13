import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { CoockiePopUp } from './comonents/coockiePopUp';

export class LoginPage extends BasePage {
  private _cookiePopUp?: CoockiePopUp;

  constructor(page: Page) {
    super(page);
  }

  get loginForm(): Locator {
    return this.page.locator('form[name="login-form"]');
  }

  get usernameInput(): Locator {
    return this.loginForm.getByTestId('username');
  }

  get passwordInput(): Locator {
    return this.loginForm.getByTestId('password');
  }

  get forgotPasswordLink(): Locator {
    return this.loginForm.getByRole('link', { name: 'Wachtwoord vergeten?' });
  }

  get loginButton(): Locator {
    return this.loginForm.getByRole('button', { name: 'Inloggen' });
  }

  get cookiePopUp(): CoockiePopUp {
    return (this._cookiePopUp ??= new CoockiePopUp(this.page));
  }

  async closeCookiePopUpIfAppears() {
    await this.page.waitForLoadState('load');
    if (await this.cookiePopUp.root.isVisible()) {
      await this.cookiePopUp.acceptAllCookies();
    }
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
