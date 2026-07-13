import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { TopBar } from './comonents/topBar';
import { normalizePrice, Price } from '../helpers/price';

export type ProductPrice = Price;

export class ProductPage extends BasePage {
  private _topBar?: TopBar;

  readonly breadcrumbs: Locator;
  readonly productDetails: Locator;
  readonly productHeader: Locator;
  readonly itemNumber: Locator;
  readonly itemName: Locator;
  readonly productImages: Locator;
  readonly attributes: Locator;
  readonly attributeRows: Locator;
  readonly buyBlock: Locator;
  readonly grossPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly referenceInput: Locator;
  readonly addToWishlistButton: Locator;

  constructor(page: Page) {
    super(page);

    this.breadcrumbs = page.getByTestId('Breadcrumbs');
    this.productDetails = page.locator('[data-testid^="product-detail-"]'); // fetch all product datails related items
    this.productHeader = this.productDetails.getByTestId('ProductHeader');
    this.itemNumber = this.productHeader.getByTestId('ItemNumber');
    this.itemName = this.productHeader.getByTestId('ItemName');
    this.productImages = this.productDetails.getByTestId('product-image-thumb');
    this.attributes = this.productDetails.getByTestId('attributes-list');
    this.attributeRows = this.attributes.getByTestId('attribute-row');
    this.buyBlock = this.productDetails.getByTestId('BuyBlock');
    this.grossPrice = this.buyBlock.getByTestId('ProductGrossPrice');
    this.quantityInput = this.buyBlock.getByTestId('SetQuantityInput');
    this.addToCartButton = this.buyBlock.getByTestId('AddToQuotationButton');
    this.referenceInput = this.buyBlock.getByTestId('item-remark-input');
    this.addToWishlistButton = this.buyBlock.getByTestId('AddToWishlistButton');
  }

  get topBar(): TopBar {
    return (this._topBar ??= new TopBar(this.page));
  }

  async verifyPartNumber(partNumber: string) {
    await expect(this.itemNumber).toHaveText(partNumber);
  }

  async getPrice(): Promise<ProductPrice> {
    return normalizePrice(await this.grossPrice.innerText());
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(quantity?: number) {
    if (quantity !== undefined) {
      await this.setQuantity(quantity);
    }

    await this.addToCartButton.click();
  }

  async verifyAddedToCart(quantity: number) {
    await expect(this.addToCartButton).toContainText(`${quantity} in`);

    // advanced try to verify the button state
    // await expect.poll(async () => {
    //   const backgroundColor = await this.addToCartButton.evaluate((button) =>
    //     getComputedStyle(button).backgroundColor
    //   );
    //   const [red, green, blue] = backgroundColor.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];

    //   return green > red && green > blue;
    // }).toBe(true);
  }
}
