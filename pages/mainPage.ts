import { Page } from '@playwright/test';
import { BasePage } from './basePage';
import { CookiePopUp } from './comonents/coockiePopUp';
import { TopBar } from './comonents/topBar';

export class MainPage extends BasePage {
  readonly topBar: TopBar;
  _cookiePopUp?: CookiePopUp;

  constructor(page: Page) {
    super(page);
    this.topBar = new TopBar(page);
  }

  get cookiePopUp(): CookiePopUp {
    return (this._cookiePopUp ??= new CookiePopUp(this.page));
  }
  
}
