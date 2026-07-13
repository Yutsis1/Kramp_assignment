import { expect, Locator, Page } from '@playwright/test';
import { BaseComponent } from './baseComponent';
import { normalizePrice, Price } from '../../helpers/price';

export class QuoteLine extends BaseComponent {
  readonly brand: Locator;
  readonly partNumber: Locator;
  readonly description: Locator;
  readonly referenceInput: Locator;
  readonly quantityInput: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly increaseQuantityButton: Locator;
  readonly unitPrice: Locator;
  readonly totalPrice: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page, root: Locator) {
    super(page, root);

    this.brand = root.getByTestId('item-brand');
    this.partNumber = root.getByTestId('item-part-number');
    this.description = root.getByTestId('item-description');
    this.referenceInput = root.getByTestId('item-comment-input-wrapper').getByRole('textbox');
    this.quantityInput = root.getByTestId('item-quantity-input');
    this.decreaseQuantityButton = root.getByTestId('item-quantity-minus');
    this.increaseQuantityButton = root.getByTestId('item-quantity-plus');
    this.unitPrice = root.getByTestId('item-price').first();
    this.totalPrice = root.getByTestId('item-total-price').first();
    this.deleteButton = root.getByTestId('delete-item-button');
  }

  async setQuantity(quantity: number | string) {
    await this.quantityInput.fill(String(quantity));
  }

  async verifyQuantityInput(quantity: number | string) {
    await expect(this.quantityInput).toHaveValue(String(quantity));
  }

  async getBruttoUnitPrice(): Promise<Price> {
    return normalizePrice(await this.unitPrice.innerText());
  }

  async getBruttoTotalPrice(): Promise<Price> {
    return normalizePrice(await this.totalPrice.innerText());
  }

  async verifyBruttoUnitPrice(price: number) {
    expect((await this.getBruttoUnitPrice()).asNumber).toBeCloseTo(price, 2);
  }

  async verifyBruttoTotal(quantity: number, price: number) {
    const expectedTotal = quantity * price;

    expect((await this.getBruttoTotalPrice()).asNumber).toBeCloseTo(expectedTotal, 2);
  }

  async verifyBruttoPriceCalculation() {
    const [quantity, unitPrice, totalPrice] = await Promise.all([
      this.quantityInput.inputValue(),
      this.getBruttoUnitPrice(),
      this.getBruttoTotalPrice(),
    ]);

    expect(totalPrice.asNumber).toBeCloseTo(Number(quantity) * unitPrice.asNumber, 2);
  }

  async remove() {
    await this.deleteButton.click();
  }
}
