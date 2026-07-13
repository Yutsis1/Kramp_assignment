import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './baseComponent';
import { SearchDialog } from './searchDialog';

export class TopBar extends BaseComponent {
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly countryChooserButton: Locator;
  readonly supportLink: Locator;
  readonly loginLink: Locator;
  readonly navigation: Locator;
  readonly navigationItems: Locator;
  readonly modelSearchLink: Locator;
  private _searchDialog?: SearchDialog;

  constructor(page: Page) {
    super(page, page.locator('#header-v2-selector'));

    this.logo = this.root.getByRole('link', { name: "Kramp - It's that easy" });
    this.searchInput = this.root.getByTestId('header-search-input').first();
    this.searchSubmitButton = this.root.getByTestId('header-search-submit').first();
    this.countryChooserButton = this.root.getByTestId('CountryChooser');
    this.supportLink = this.root.getByTestId('FaqItem').getByRole('link');
    this.loginLink = this.root.getByRole('link', { name: 'Login' });
    this.navigation = this.root.getByTestId('header-navigation');
    this.navigationItems = this.navigation.getByTestId('header-navigation-main-item');
    this.modelSearchLink = this.navigation.getByRole('link', { name: 'Zoek op model' });
  }

  get searchDialog(): SearchDialog {
    return (this._searchDialog ??= new SearchDialog(this.page));
  }

  async searchFor(query: string) {
    await this.searchInput.fill(query);
    await this.searchSubmitButton.click();
  }

  async openCountryChooser() {
    await this.countryChooserButton.click();
  }

  async openNavigationItem(name: string) {
    await this.navigation.getByRole('link', { name, exact: true }).click();
  }
}
