import { expect, Locator, Page } from '@playwright/test';
import { normalizePrice, Price } from '../../helpers/price';
import { BaseComponent } from './baseComponent';

export class ConfirmationLine extends BaseComponent {
  readonly brand: Locator;
  readonly partNumber: Locator;
  readonly description: Locator;
  readonly quantity: Locator;
  readonly bruttoUnitPrice: Locator;
  readonly bruttoTotalPrice: Locator;

  constructor(page: Page, root: Locator) {
    super(page, root);

    this.brand = root.getByTestId('ItemBrand');
    this.partNumber = root.getByTestId('ItemNumber');
    this.description = root.getByTestId('ItemDescription');
    this.quantity = root.getByTestId('item-quantity');
    this.bruttoUnitPrice = root.getByTestId('item-gross-prices').getByTestId('item-price');
    this.bruttoTotalPrice = root.getByTestId('item-gross-prices').getByTestId('item-total-price');
  }

  async getQuantity(): Promise<number> {
    return Number((await this.quantity.innerText()).trim());
  }

  async getBruttoUnitPrice(): Promise<Price> {
    return normalizePrice(await this.bruttoUnitPrice.innerText());
  }

  async getBruttoTotalPrice(): Promise<Price> {
    return normalizePrice(await this.bruttoTotalPrice.innerText());
  }

  async verifyQuantity(expectedQuantity: number) {
    await expect(this.quantity).toHaveText(String(expectedQuantity));
  }

  async verifyBruttoUnitPrice(expectedPrice: number) {
    expect((await this.getBruttoUnitPrice()).asNumber).toBeCloseTo(expectedPrice, 2);
  }

  async verifyBruttoTotal(expectedQuantity: number, expectedUnitPrice: number) {
    expect((await this.getBruttoTotalPrice()).asNumber).toBeCloseTo(
      expectedQuantity * expectedUnitPrice,
      2
    );
  }

  async verifyBruttoPriceCalculation() {
    const [quantity, unitPrice, totalPrice] = await Promise.all([
      this.getQuantity(),
      this.getBruttoUnitPrice(),
      this.getBruttoTotalPrice(),
    ]);

    expect(totalPrice.asNumber).toBeCloseTo(quantity * unitPrice.asNumber, 2);
  }
}
