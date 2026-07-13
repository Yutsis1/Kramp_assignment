import { Page } from '@playwright/test';
import { BasePage } from './basePage';
import { CoockiePopUp } from './comonents/coockiePopUp';
import { TopBar } from './comonents/topBar';

export class MainPage extends BasePage {
  readonly topBar: TopBar;
  _cookiePopUp?: CoockiePopUp;

  constructor(page: Page) {
    super(page);
    this.topBar = new TopBar(page);
  }

  get cookiePopUp(): CoockiePopUp {
    return (this._cookiePopUp ??= new CoockiePopUp(this.page));
  }
  
}
