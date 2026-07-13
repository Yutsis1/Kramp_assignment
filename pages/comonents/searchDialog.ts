import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './baseComponent';

export class SearchDialog extends BaseComponent {
  readonly spellingSuggestionsNotFound: Locator;
  readonly partNumberSuggestions: Locator;
  readonly partNumberSuggestionItems: Locator;

  constructor(page: Page) {
    super(page, page.getByTestId('search-suggestions'));

    this.spellingSuggestionsNotFound = this.root.getByTestId('spelling-suggestions-not-found');
    this.partNumberSuggestions = this.root.getByTestId('part-number-suggestions');
    this.partNumberSuggestionItems = this.partNumberSuggestions.getByTestId('part-number-suggestion');
  }

  partNumberSuggestion(partNumber: string): Locator {
    return this.partNumberSuggestionItems
      .filter({ has: this.page.getByTestId('item-suggestion-id').getByText(partNumber, { exact: true }) })
      .first();
  }

  async selectPartNumberSuggestion(partNumber: string) {
    await this.partNumberSuggestion(partNumber).click();
  }
}
