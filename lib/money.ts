import Decimal from "decimal.js";

Decimal.set({ rounding: Decimal.ROUND_HALF_UP, precision: 20 });

export type MoneyInput = Decimal.Value | null | undefined;

export function dec(value: MoneyInput): Decimal {
  return new Decimal(value ?? 0);
}

export function money(value: MoneyInput): string {
  return dec(value).toFixed(2);
}

export function sum(values: MoneyInput[]): string {
  return values.reduce<Decimal>((total, value) => total.plus(dec(value)), dec(0)).toFixed(2);
}

export function multiply(quantity: MoneyInput, unitPrice: MoneyInput): string {
  return dec(quantity).times(dec(unitPrice)).toFixed(2);
}

const amountFormat = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatAmount(value: MoneyInput): string {
  return `₹${amountFormat.format(dec(value).toNumber())}`;
}

export function formatCompactAmount(value: MoneyInput): string {
  const n = dec(value).toNumber();
  if (Math.abs(n) >= 100000) {
    const lakh = (n / 100000).toFixed(2);
    return `₹${lakh}L`;
  }
  return formatAmount(value);
}

export function formatPlainAmount(value: MoneyInput): string {
  return amountFormat.format(dec(value).toNumber());
}

export function isPositive(value: MoneyInput): boolean {
  return dec(value).greaterThan(0);
}
