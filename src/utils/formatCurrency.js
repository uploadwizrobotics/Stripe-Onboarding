import { config } from './config';

const formatter = new Intl.NumberFormat(config.locale, {
  style: 'currency',
  currency: config.currency,
  currencyDisplay: 'narrowSymbol',
});

/** Cents -> "$29.00". All money moves through here. */
export function formatCurrency(cents) {
  return formatter.format((Number(cents) || 0) / 100);
}

/** "29" / "29.50" -> 2950. Returns 0 for anything unparseable. */
export function toCents(input) {
  const n = Number(String(input).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/** Amounts Stripe hasn't settled yet come back null. */
export function formatOptionalCurrency(cents) {
  return cents == null ? '—' : formatCurrency(cents);
}
