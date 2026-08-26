/** Sidebar identity. Fixed on purpose — everyone onboarding sees the same
    store, so there's one less thing to configure. */
export const STORE_NAME = 'Stripe Test Store';

export const OWNER = { name: 'John Doe', role: 'Owner' };

/** Filter chips above the transactions ledger. Ids match the mapped status,
    lowercased — see mapCharge in stripe-api.js. */
export const TX_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'succeeded', label: 'Succeeded' },
  { id: 'refunded', label: 'Refunded' },
  { id: 'failed', label: 'Failed' },
];
