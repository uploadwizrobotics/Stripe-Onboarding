const SHORT = new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' });
const FULL = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

/** "Aug 26" — the ledger's date column. */
export function formatDate(iso) {
  return SHORT.format(new Date(iso));
}

/** "Aug 26, 2:14 p.m." — drawer timeline entries. */
export function formatDateTime(iso) {
  return FULL.format(new Date(iso));
}
