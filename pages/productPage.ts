import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { TopBar } from './comonents/topBar';

export type ProductPrice = {
  asNumber: number;
  asString: string;
};

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
    const asString = (await this.grossPrice.innerText()).trim();
    const numericPrice = asString.replace(/[^\d,.-]/g, '').replace(',', '.');
    const asNumber = Number(numericPrice);

    if (Number.isNaN(asNumber)) {
      throw new Error(`Could not parse product price: "${asString}"`);
    }

    return { asNumber, asString };
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
