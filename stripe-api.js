import express from 'express';
import Stripe from 'stripe';

/**
 * The Stripe API, mounted inside Vite's dev server.
 *
 * This runs in Node, not the browser — which is the whole point. The secret key
 * stays on this side, and the React app just calls /api/… on its own origin.
 *
 * STRIPE_SECRET_KEY deliberately has no VITE_ prefix: Vite only inlines
 * VITE_*-prefixed variables into the browser bundle, so this one can't leak
 * into it.
 */
export function stripeApi({ secretKey, currency = 'cad' }) {
  /* Fail at startup rather than on the first request — a missing or mistyped
     key is the most common setup mistake, and a live key would move real
     money. */
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is missing.\n' +
        '  Copy .env.example to .env and add your Stripe test key.',
    );
  }
  if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('rk_test_')) {
    throw new Error(
      'STRIPE_SECRET_KEY must be a test key (sk_test_… or rk_test_…).\n' +
        '  This app is a sandbox — it will not run against live keys.',
    );
  }

  const stripe = new Stripe(secretKey);
  const CURRENCY = currency.toLowerCase();
  const LIMIT = 50;

  const badRequest = (message) => Object.assign(new Error(message), { statusCode: 400 });

  /* Placeholder for the TODOs below — delete each one as you implement it. */
  const notImplemented = (n) =>
    Object.assign(new Error(`Not implemented yet — see TODO(${n}) in stripe-api.js`), {
      statusCode: 501,
    });

  /* ----------------------------- Mapping ---------------------------------- *
   * Stripe's objects into the rows the tables render. Stripe field names stop
   * here — nothing past this file knows what a balance transaction is.
   * ------------------------------------------------------------------------ */

  /**
   * TODO(1) — a Stripe product -> one row of the Products table
   *
   * `src/pages/products/components/ProductTable.jsx` renders these fields, so
   * return exactly them:
   *
   *   id      the Stripe product id
   *   name    the product's name
   *   blurb   its description, '' when there isn't one
   *   sku     metadata.sku, '' when there isn't one
   *   price   the default price's amount, in cents. 0 if there's no price
   *   status  'Active' or 'Draft' — the chip colours come from these exact
   *           strings (see src/styles/theme.js), so spelling counts
   *
   * The row also shows `initials` and `sold`, but those are derived in
   * src/store/StoreProvider.jsx — not your job here.
   *
   * Careful: `default_price` is an id string unless the call that fetched the
   * product expanded it. Fall back to 0 rather than crashing.
   */
  const mapProduct = (product) => {
    throw notImplemented(1);
  };

  /**
   * TODO(7) — a Stripe charge -> one row of the Transactions table
   *
   * `item` is handed in by TODO(8), which digs the product name out of the
   * checkout session. Fall back to the charge's own description, then '—'.
   *
   * The table and the detail drawer render:
   *
   *   id        the Stripe charge id
   *   customer  the billing name, 'Guest checkout' when there isn't one
   *   email     the billing email, '—' when absent
   *   item      see above
   *   gross     the charge amount, in cents
   *   fee       Stripe's fee, in cents
   *   net       what you actually keep, in cents
   *   status    'Succeeded' | 'Refunded' | 'Failed' | 'Pending' — these exact
   *             strings drive both the chip colour and the filter buttons, so
   *             spelling counts. Note a refunded charge still reports its own
   *             status as succeeded, so check the refunded flag first
   *   date      an ISO string. Stripe counts seconds since the epoch; JS Dates
   *             want milliseconds
   *   card      e.g. 'visa · 4242', from the payment method details, '—' when
   *             absent
   *
   * fee and net live on the charge's balance transaction, which is an id
   * unless it was expanded — and doesn't exist at all until Stripe settles the
   * charge. Return null, not 0, when you can't read them: the table prints '—'
   * for null, and 0 would be a lie.
   */
  const mapCharge = (charge, item) => {
    throw notImplemented(7);
  };

  /**
   * TODO(4) — a Stripe payment link -> one row of the Payment links table
   *
   * `src/pages/payment-links/components/PaymentLinkTable.jsx` renders:
   *
   *   id        the Stripe payment link id
   *   url       the checkout URL — the Open button links straight to it
   *   item      what's being sold. Take it from the link's first line item
   *   amount    total in cents: the line item's unit amount x its quantity
   *   customer  metadata.customer_name — TODO(6) is what puts it there.
   *             '—' when absent
   *   status    'Active' or 'Inactive', from the link's own active flag
   *
   * A link's line items only come back if the call asked for them, so handle
   * their absence without crashing.
   */
  const mapPaymentLink = (link) => {
    throw notImplemented(4);
  };


  /* ------------------------------ Routes ---------------------------------- */

  const app = express();
  app.use(express.json());

  /**
   * Return a value and it's sent as JSON; throw and it becomes
   * `{ error: message }` with the right status.
   */
  const route = (handler) => async (req, res) => {
    try {
      res.json(await handler(req));
    } catch (error) {
      const status = error.statusCode || 500;
      const message =
        status === 401
          ? 'Stripe rejected the API key. Check STRIPE_SECRET_KEY in .env.'
          : error.raw?.message || error.message || 'Something went wrong talking to Stripe.';

      console.error(`[${req.method} ${req.path}] ${message}`);
      res.status(status).json({ error: message });
    }
  };

  /**
   * TODO(2) — list products
   *
   * Return an array of every ACTIVE product, each passed through mapProduct().
   * Cap the result at LIMIT.
   *
   * mapProduct() reads `product.default_price.unit_amount`, so the price has to
   * come back as an object, not an id.
   *
   * Symptoms if it's not quite right:
   *   · every price renders $0.00      → the price came back as an id string
   *   · dozens of unfamiliar products  → archived ones are included by default
   *
   * Docs: https://stripe.com/docs/api/products/list
   *       https://stripe.com/docs/api/expanding_objects
   */
  app.get(
    '/api/products',
    route(async () => {
      return []; // TODO(2)
    }),
  );

  app.post(
    '/api/products',
    route(async (req) => {
      const { name, blurb, price, sku } = req.body;
      if (!name?.trim()) throw badRequest('A product name is required.');

      // TODO(3) — create the product in Stripe and return mapProduct(product).
      //
      // In Stripe a product and its price are two different objects. Creating a
      // product alone gives you something with no amount attached, which this
      // admin can't turn into a payment link. There is a way to create both in
      // one call.
      //
      // Set on the new product:
      //   name         `name`, trimmed
      //   description  `blurb` (omit if empty)
      //   metadata.sku `sku`   (omit if empty)
      //   amount       `price` — already in cents — in CURRENCY
      //   active       true, so it shows up in TODO(2)'s list
      //
      // Remember mapProduct() needs the price expanded.
      //
      // Symptom if wrong: the product appears with $0.00, or the toast reports
      // a Stripe error.
      //
      // Docs: https://stripe.com/docs/api/products/create
      //       https://stripe.com/docs/api/prices/create
      throw notImplemented(3);
    }),
  );

  /**
   * TODO(8) — list transactions
   *
   * Return an array of charges, each through mapCharge(charge, item), capped at
   * LIMIT. Do this one AFTER you've taken a real test payment, so there's
   * something to look at.
   *
   * Two things mapCharge() needs that a plain charge doesn't carry:
   *
   *   1. Stripe's fee and net. These live on the charge's balance transaction,
   *      which comes back as an id unless you expand it.
   *
   *   2. The item name — the second argument. A charge made through a payment
   *      link has NO description; the product name lives on the Checkout
   *      Session that produced it. So fetch the sessions too (their line items
   *      hold the name) and match each session to its charge. Both objects
   *      reference the same payment intent — that's your join key.
   *
   *      Careful: depending on the call, `payment_intent` is sometimes an id
   *      string and sometimes an object. Handle both.
   *
   *      Do it with two list calls and a lookup table, not one call per row.
   *
   * Symptoms if wrong:
   *   · Fee and Net columns show —      → balance transaction not expanded
   *   · Item column shows —, Sold is 0  → sessions not joined
   *
   * Docs: https://stripe.com/docs/api/charges/list
   *       https://stripe.com/docs/api/checkout/sessions/list
   */
  app.get(
    '/api/transactions',
    route(async () => {
      return []; // TODO(8)
    }),
  );

  app.post(
    '/api/transactions/:chargeId/refund',
    route(async (req) => {
      // TODO(9) — refund the charge in `req.params.chargeId`, then return the
      // updated charge through mapCharge().
      //
      // Refunding doesn't hand back the charge, and the copy you already have
      // is now stale — its refunded flag is still false. Re-read it so the row
      // in the UI flips to "Refunded". Same expansion note as TODO(8) applies.
      //
      // Symptom if wrong: the toast says refunded but the row still reads
      // "Succeeded" until you reload.
      //
      // Docs: https://stripe.com/docs/api/refunds/create
      //       https://stripe.com/docs/api/charges/retrieve
      throw notImplemented(9);
    }),
  );

  /**
   * TODO(5) — list payment links
   *
   * Return an array of payment links, each through mapPaymentLink(), capped at
   * LIMIT.
   *
   * mapPaymentLink() reads the link's line items — its first line item's
   * description and price. Those aren't included unless you ask for them.
   *
   * Watch out: Stripe refuses to expand more than 4 levels deep, and on a LIST
   * call every path already starts with `data.`. If Stripe rejects your expand,
   * count the dots — and note that the line item's own `description` is already
   * the product name, so you may not need to go as deep as you think.
   *
   * Symptom if wrong: rows show "Payment link" and $0.00, or the request 400s.
   *
   * Docs: https://stripe.com/docs/api/payment-links/list
   */
  app.get(
    '/api/payment-links',
    route(async () => {
      return []; // TODO(5)
    }),
  );

  app.post(
    '/api/payment-links',
    route(async (req) => {
      const { productId, amount, quantity, customerName } = req.body;
      if (!productId) throw badRequest('Pick a product first.');

      // TODO(6) — create a payment link and return mapPaymentLink(link).
      //
      // This is the tricky one. A payment link bills a PRICE, not a product and
      // not a raw number — so you cannot hand Stripe `amount` directly.
      //
      // The form lets someone override the amount, so:
      //   · if `amount` matches the product's existing default price,
      //     reuse that price
      //   · if it differs, create a new price for that product at `amount`
      //     in CURRENCY, and use that one
      //   · if there's no price to use at all,
      //     throw badRequest('That product has no price to bill.')
      //
      // Then create the link with that price and `quantity` (at least 1), and
      // stash `customerName` in metadata as `customer_name` — mapPaymentLink()
      // reads it back from there. mapPaymentLink() needs line items expanded.
      //
      // Symptom if wrong: the toast shows a Stripe error, or the new row shows
      // the wrong amount.
      //
      // Docs: https://stripe.com/docs/api/payment-links/create
      //       https://stripe.com/docs/api/prices/create
      //       https://stripe.com/docs/api/products/retrieve
      throw notImplemented(6);
    }),
  );

  app.get('/api/health', (_req, res) => res.json({ ok: true, mode: 'test' }));

  /* Anything else under /api is a typo — answer it here rather than letting
     Vite return index.html. */
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  return {
    name: 'stripe-api',
    configureServer(server) {
      server.middlewares.use(app);
    },
    configurePreviewServer(server) {
      server.middlewares.use(app);
    },
  };
}
