/**
 * Stripe playground.
 *
 *   npm run scratch
 *
 * A place to run Stripe calls on their own, exactly as the docs show them,
 * without the app in the way. Paste an example from stripe.com/docs/api,
 * run it, look at what comes back — then wire the version that worked into
 * the real code.
 *
 * TRANSLATING FROM THE DOCS
 *
 * Stripe's docs show CommonJS with the key inline:
 *
 *     const stripe = require('stripe')('sk_test_51Qp...');
 *     const product = await stripe.products.create({ name: 'Gold Plan' });
 *
 * This project is ESM, and the key belongs in .env, so the same two lines are:
 *
 *     import Stripe from 'stripe';
 *     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 *
 * That's the whole difference. Everything after `stripe.` — every method name,
 * every argument — is identical to the docs. Never paste a key into a file;
 * `npm run scratch` loads .env for you.
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('\n  STRIPE_SECRET_KEY is missing.');
  console.error('  Copy .env.example to .env and add your Stripe test key.\n');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/** Prints a result without drowning you in Stripe's full object. */
const show = (label, value) => {
  console.log(`\n─── ${label} ${'─'.repeat(Math.max(0, 60 - label.length))}`);
  console.dir(value, { depth: 3, colors: true });
};

/* ══════════════════════════════════════════════════════════════════════════
 * Edit below. Comment things in and out freely — this file affects nothing
 * else, though anything you create here is real and shows up in your
 * Dashboard.
 * ══════════════════════════════════════════════════════════════════════════ */

// ── List products ──────────────────────────────────────────────────────────
// Docs: https://stripe.com/docs/api/products/list
const products = await stripe.products.list({ limit: 3 });
show('products.list', products.data.map((p) => ({
  id: p.id,
  name: p.name,
  active: p.active,
  default_price: p.default_price, // an id string — until you expand it
})));

// Same call, expanded. Compare `default_price` in the two outputs: that
// difference is the single most common cause of "why is my price $0.00?"
const expanded = await stripe.products.list({ limit: 3, expand: ['data.default_price'] });
show('products.list (expanded)', expanded.data.map((p) => ({
  id: p.id,
  name: p.name,
  default_price: p.default_price?.unit_amount, // now a number, in cents
})));

// ── Create a product ───────────────────────────────────────────────────────
// Docs: https://stripe.com/docs/api/products/create
//
// const product = await stripe.products.create({
//   name: 'Gold Plan',
//   default_price_data: { currency: 'cad', unit_amount: 2900 }, // cents
// });
// show('products.create', product);

// ── List payment links ─────────────────────────────────────────────────────
// Docs: https://stripe.com/docs/api/payment-links/list
//
// const links = await stripe.paymentLinks.list({ limit: 3, expand: ['data.line_items'] });
// show('paymentLinks.list', links.data.map((l) => ({
//   url: l.url,
//   item: l.line_items?.data?.[0]?.description,
// })));

// ── Create a payment link ──────────────────────────────────────────────────
// Docs: https://stripe.com/docs/api/payment-links/create
//
// A link bills a PRICE, not a product and not a number. Grab a price id from
// the expanded list above.
//
// const link = await stripe.paymentLinks.create({
//   line_items: [{ price: 'price_...', quantity: 1 }],
// });
// show('paymentLinks.create', link.url);

// ── List charges ───────────────────────────────────────────────────────────
// Docs: https://stripe.com/docs/api/charges/list
//
// `fee` and `net` live on the balance transaction, not the charge.
//
// const charges = await stripe.charges.list({ limit: 3, expand: ['data.balance_transaction'] });
// show('charges.list', charges.data.map((c) => ({
//   id: c.id,
//   amount: c.amount,
//   description: c.description,          // null for payment link charges
//   fee: c.balance_transaction?.fee,
//   net: c.balance_transaction?.net,
// })));

// ── Where the item name actually lives ─────────────────────────────────────
// Docs: https://stripe.com/docs/api/checkout/sessions/list
//
// A payment link charge has no description. The product name is on the
// checkout session, and both point at the same payment_intent.
//
// const sessions = await stripe.checkout.sessions.list({ limit: 3, expand: ['data.line_items'] });
// show('checkout.sessions.list', sessions.data.map((s) => ({
//   payment_intent: s.payment_intent,
//   item: s.line_items?.data?.[0]?.description,
// })));

// ── Refund ─────────────────────────────────────────────────────────────────
// Docs: https://stripe.com/docs/api/refunds/create
//
// const refund = await stripe.refunds.create({ charge: 'ch_...' });
// show('refunds.create', refund.status);
