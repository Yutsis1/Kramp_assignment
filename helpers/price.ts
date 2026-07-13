export type Price = {
  asNumber: number;
  asString: string;
};

export function normalizePrice(displayedPrice: string): Price {
  const asString = displayedPrice.trim();
  const numericPrice = asString
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.');
  const asNumber = Number(numericPrice);

  if (Number.isNaN(asNumber)) {
    throw new Error(`Unable to parse price: "${asString}"`);
  }

  return { asNumber, asString };
}
