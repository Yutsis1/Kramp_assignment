import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { ConfirmationLine } from './comonents/confirmationLine';

export class ConfirmationPage extends BasePage {
  readonly confirmationPanel: Locator;
  readonly confirmationHeading: Locator;
  readonly confirmationText: Locator;
  readonly orderNumber: Locator;
  readonly printButton: Locator;
  readonly orderOverviewLink: Locator;
  readonly contactAndFaqLink: Locator;
  readonly finalItems: Locator;

  constructor(page: Page) {
    super(page);

    this.confirmationPanel = page.getByTestId('panel').filter({
      has: page.getByTestId('ConfirmationText'),
    });
    this.confirmationHeading = this.confirmationPanel.getByRole('heading', {
      name: 'Dank u voor uw bestelling',
    });
    this.confirmationText = this.confirmationPanel.getByTestId('ConfirmationText');
    this.orderNumber = this.confirmationText.getByTestId('OrderNumber');
    this.printButton = page.getByText('Afdrukken', { exact: true });
    this.orderOverviewLink = page.getByRole('link', { name: 'besteloverzicht te gaan' });
    this.contactAndFaqLink = page.getByRole('link', { name: 'contact- en FAQ-pagina' });
    this.finalItems = page.getByTestId('ItemFinal');
  }

  itemForPartNumber(partNumber: string): ConfirmationLine {
    const root = this.finalItems.filter({
      has: this.page.getByTestId('ItemNumber').getByText(partNumber, { exact: true }),
    });

    return new ConfirmationLine(this.page, root);
  }

  async getOrderNumber(): Promise<string> {
    return (await this.orderNumber.innerText()).trim();
  }

  async verifyOrderConfirmed() {
    await expect(this.confirmationHeading).toBeVisible();
    await expect(this.orderNumber).toHaveText(/\S+/);
  }

  async verifyPartNumber(partNumber: string) {
    await this.itemForPartNumber(partNumber).expectVisible();
  }
}
