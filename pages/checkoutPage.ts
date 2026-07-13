import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class CheckoutPage extends BasePage {
  readonly backToCartLink: Locator;
  readonly orderConfirmationButton: Locator;
  readonly deliveryAddressOptions: Locator;
  readonly moreAddressesButton: Locator;
  readonly deliveryMethodSelect: Locator;
  readonly quotationOverviewLink: Locator;
  readonly quotationOverviewTable: Locator;
  readonly shippingCostsLink: Locator;
  readonly totalDeliveryCost: Locator;
  readonly priceTable: Locator;
  readonly grossPrice: Locator;
  readonly totalPriceWithoutVat: Locator;
  readonly totalPrice: Locator;
  readonly paymentOptions: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);

    this.backToCartLink = page.locator('[data-area="prev"]');
    this.orderConfirmationButton = page.locator('[data-area="next"]');
    this.deliveryAddressOptions = page
      .getByRole('heading', { name: 'Leveradres' })
      .locator('..')
      .getByRole('radiogroup');
    this.moreAddressesButton = page.getByRole('button', { name: 'More addresses' });
    this.deliveryMethodSelect = page.locator('select[name="delivery-options"]');
    this.quotationOverviewLink = page.getByTestId('quotation-overview-link');
    this.quotationOverviewTable = page.getByTestId('quotation-overview-table');
    this.shippingCostsLink = page.getByTestId('shipping-costs-link');
    this.totalDeliveryCost = page.getByTestId('total-delivery-cost');
    this.priceTable = page.getByTestId('price-table');
    this.grossPrice = page.getByTestId('gross-price-cell');
    this.totalPriceWithoutVat = page.getByTestId('total-price-without-vat-cell');
    this.totalPrice = page.getByTestId('total-price-cell');
    this.paymentOptions = page.getByTestId('payment-options');
    this.placeOrderButton = page.getByTestId('checkout-button');
  }

  deliveryAddress(addressName: string): Locator {
    return this.deliveryAddressOptions.getByRole('radio', { name: addressName, exact: true });
  }

  paymentMethod(name: string): Locator {
    return this.paymentOptions.getByRole('radio', { name, exact: true });
  }

  async selectDeliveryAddress(addressName: string) {
    await this.deliveryAddress(addressName).click();
  }

  async selectDeliveryMethod(method: string) {
    await this.deliveryMethodSelect.selectOption({ label: method });
  }

  async selectPaymentMethod(method: string) {
    await this.paymentMethod(method).click();
  }

  async placeOrder() {
    await this.verifyReady();
    await this.placeOrderButton.click();
  }

  async verifyReady() {
    await expect(this.deliveryAddressOptions).toBeVisible();
    await expect(this.totalDeliveryCost).toBeVisible();
    await expect(this.shippingCostsLink).toBeVisible();
    await expect(this.placeOrderButton).toBeVisible();
  }
}
