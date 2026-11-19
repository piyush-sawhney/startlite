/**
 * Display-only money helpers.
 *
 * The server recomputes every total. These helpers exist so a cart can show a
 * running price without a round trip. They use integer paise, never floats.
 */

export function toPaise(value: string | number): number {
  const text = String(value).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return 0;
  const [rupees, fraction = ""] = text.split(".");
  return Number(rupees) * 100 + Number(fraction.padEnd(2, "0").slice(0, 2));
}

export function fromPaise(paise: number): string {
  const sign = paise < 0 ? "-" : "";
  const absolute = Math.abs(Math.round(paise));
  return `${sign}${Math.floor(absolute / 100)}.${String(absolute % 100).padStart(2, "0")}`;
}

export function addPaise(...values: Array<string | number>): number {
  return values.reduce<number>(
    (total, value) => total + toPaise(value),
    0,
  );
}

export function multiplyPaise(quantity: string, unitPrice: string): number {
  // Quantity may be decimal. Split into whole and fraction to stay in integers.
  const text = String(quantity).trim();
  const [whole, fraction = ""] = text.split(".");
  const wholePart = Number(whole) * toPaise(unitPrice);
  const fractionPart = fraction
    ? Math.round((toPaise(unitPrice) * Number(`0.${fraction}`)))
    : 0;
  return wholePart + fractionPart;
}

export function formatPaise(paise: number): string {
  const amount = fromPaise(paise);
  const [rupees, fraction] = amount.split(".");
  const grouped = Number(rupees).toLocaleString("en-IN");
  return `₹${grouped}.${fraction}`;
}
