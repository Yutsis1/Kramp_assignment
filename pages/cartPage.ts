import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { QuoteLine } from './comonents/quoteLine';
import { TopBar } from './comonents/topBar';

export class CartPage extends BasePage {
  private _topBar?: TopBar;
  private _quoteLine?: QuoteLine;

  readonly cartLines: Locator;
  readonly checkoutButton: Locator;
  readonly grossTotal: Locator;
  readonly netTotal: Locator;
  readonly totalExcludingVat: Locator;
  readonly quickAddPartNumberInput: Locator;
  readonly quickAddQuantityInput: Locator;
  readonly quickAddReferenceInput: Locator;
  readonly quickAddButton: Locator;

  constructor(page: Page) {
    super(page);

    this.cartLines = page.getByTestId('quotation-line');
    this.checkoutButton = page.getByTestId('checkout-button').first();
    this.grossTotal = page.getByTestId('price-summary-gross').first();
    this.netTotal = page.getByTestId('price-summary-net').first();
    this.totalExcludingVat = page.getByTestId('price-summary-total').first();
    this.quickAddPartNumberInput = page.getByTestId('c-quotation-search-items-in-quotation');
    this.quickAddQuantityInput = page.getByTestId('c-quotation-quantity');
    this.quickAddReferenceInput = page.getByTestId('c-quotation-comment');
    this.quickAddButton = page.getByTestId('c-quotation-add-item-button');
  }

  get topBar(): TopBar {
    return (this._topBar ??= new TopBar(this.page));
  }

  get quoteLine(): QuoteLine {
    return (this._quoteLine ??= new QuoteLine(this.page, this.cartLines.first()));
  }

  lineForPartNumber(partNumber: string): QuoteLine {
    const root = this.cartLines.filter({
      has: this.page.getByTestId('item-part-number').getByText(partNumber, { exact: true }),
    });

    return new QuoteLine(this.page, root);
  }

  async verifyPartNumberInCart(partNumber: string) {
    await expect(this.lineForPartNumber(partNumber).root).toBeVisible();
  }

  async getTotalExcludingVat(): Promise<string> {
    return (await this.totalExcludingVat.innerText()).trim();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
