import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './baseComponent';
import { SearchDialog } from './searchDialog';

export class TopBar extends BaseComponent {
  private _searchDialog?: SearchDialog;

  constructor(page: Page) {
    super(page, page.locator('#header-v2-selector'));

  }

  get logo(): Locator {
    return this.root.getByRole('link', { name: "Kramp - It's that easy" });
  }

  get searchInput(): Locator {
    return this.root.getByTestId('header-search-input').first();
  }

  get searchSubmitButton(): Locator {
    return this.root.getByTestId('header-search-submit').first();
  }

  get countryChooserButton(): Locator {
    return this.root.getByTestId('CountryChooser');
  }

  get supportLink(): Locator {
    return this.root.getByTestId('FaqItem').getByRole('link');
  }

  /** Only rendered for guests. */
  get loginLink(): Locator {
    return this.root.getByRole('link', { name: 'Login' });
  }

  /** Only rendered for authenticated users. */
  get accountButton(): Locator {
    return this.root.getByTestId('AccountItem');
  }

  /** Only rendered for authenticated users. */
  get wishlistLink(): Locator {
    return this.root.getByTestId('wishlist-item').getByRole('link');
  }

  /** Only rendered for authenticated users. */
  get wishlistMenuButton(): Locator {
    return this.root.getByTestId('wishlist-item-trigger');
  }

  /** Only rendered for authenticated users. */
  get shoppingCartLink(): Locator {
    return this.root.getByTestId('ShoppingCartButton').getByRole('link');
  }

  /** Only rendered for authenticated users. */
  get shoppingCartMenuButton(): Locator {
    return this.root.getByTestId('shopping-cart-item-trigger');
  }

  /** Only rendered for authenticated users. */
  get shoppingCartCounter(): Locator {
    return this.root.getByTestId('shopping-cart-counter');
  }

  get navigation(): Locator {
    return this.root.getByTestId('header-navigation');
  }

  get navigationItems(): Locator {
    return this.navigation.getByTestId('header-navigation-main-item');
  }

  get modelSearchLink(): Locator {
    return this.navigation.getByRole('link', { name: 'Zoek op model' });
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

  async isLoggedIn(): Promise<boolean> {
    return this.accountButton.isVisible();
  }

  async validateShoppingCartCount(expectedCount: number): Promise<boolean> {
    const countText = await this.shoppingCartCounter.textContent();
    return parseInt(countText || '0', 10) === expectedCount;
  }

  async openNavigationItem(name: string) {
    await this.navigation.getByRole('link', { name, exact: true }).click();
  }
}
