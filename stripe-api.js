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

  /* ----------------------------- Mapping ---------------------------------- *
   * Stripe's objects into what the UI renders, so Stripe field names never
   * leak into the React code.
   * ------------------------------------------------------------------------ */

  const mapProduct = (product) => {
    const price = product.default_price;
    const hasPrice = price && typeof price === 'object';

    return {
      id: product.id,
      name: product.name,
      blurb: product.description || '',
      sku: product.metadata?.sku || '',
      price: hasPrice ? (price.unit_amount ?? 0) : 0,
      status: product.active ? 'Active' : 'Draft',
    };
  };

  const mapCharge = (charge, item) => {
    const balance = charge.balance_transaction;
    const settled = balance && typeof balance === 'object';
    const card = charge.payment_method_details?.card;

    let status = 'Pending';
    if (charge.refunded) status = 'Refunded';
    else if (charge.status === 'succeeded') status = 'Succeeded';
    else if (charge.status === 'failed') status = 'Failed';

    return {
      id: charge.id,
      customer: charge.billing_details?.name || 'Guest checkout',
      email: charge.billing_details?.email || '—',
      item: item || charge.description || '—',
      gross: charge.amount,
      // Stripe's real numbers, null until the balance transaction settles.
      fee: settled ? balance.fee : null,
      net: settled ? balance.net : null,
      status,
      date: new Date(charge.created * 1000).toISOString(),
      card: card ? `${card.brand} · ${card.last4}` : '—',
    };
  };

  /* Note: don't expand through to price.product for the name — on the list
     call that's `data.line_items.data.price.product`, five levels deep, and
     Stripe caps expansion at four. The line item's own description is the
     product name anyway. */
  const mapPaymentLink = (link) => {
    const lineItem = link.line_items?.data?.[0];
    const price = lineItem?.price;

    return {
      id: link.id,
      url: link.url,
      item: lineItem?.description || 'Payment link',
      amount: (price?.unit_amount ?? 0) * (lineItem?.quantity ?? 1),
      customer: link.metadata?.customer_name || '—',
      status: link.active ? 'Active' : 'Inactive',
    };
  };

  const badRequest = (message) => Object.assign(new Error(message), { statusCode: 400 });

  /* Placeholder for the TODOs below — delete each one as you implement it. */
  const notImplemented = (n) =>
    Object.assign(new Error(`Not implemented yet — see TODO(${n}) in stripe-api.js`), {
      statusCode: 501,
    });

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
   * TODO(1) — list products
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
      return []; // TODO(1)
    }),
  );

  app.post(
    '/api/products',
    route(async (req) => {
      const { name, blurb, price, sku } = req.body;
      if (!name?.trim()) throw badRequest('A product name is required.');

      // TODO(2) — create the product in Stripe and return mapProduct(product).
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
      //   active       true, so it shows up in TODO(1)'s list
      //
      // Remember mapProduct() needs the price expanded.
      //
      // Symptom if wrong: the product appears with $0.00, or the toast reports
      // a Stripe error.
      //
      // Docs: https://stripe.com/docs/api/products/create
      //       https://stripe.com/docs/api/prices/create
      throw notImplemented(2);
    }),
  );

  /**
   * TODO(5) — list transactions
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
      return []; // TODO(5)
    }),
  );

  app.post(
    '/api/transactions/:chargeId/refund',
    route(async (req) => {
      // TODO(6) — refund the charge in `req.params.chargeId`, then return the
      // updated charge through mapCharge().
      //
      // Refunding doesn't hand back the charge, and the copy you already have
      // is now stale — its refunded flag is still false. Re-read it so the row
      // in the UI flips to "Refunded". Same expansion note as TODO(5) applies.
      //
      // Symptom if wrong: the toast says refunded but the row still reads
      // "Succeeded" until you reload.
      //
      // Docs: https://stripe.com/docs/api/refunds/create
      //       https://stripe.com/docs/api/charges/retrieve
      throw notImplemented(6);
    }),
  );

  /**
   * TODO(3) — list payment links
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
      return []; // TODO(3)
    }),
  );

  app.post(
    '/api/payment-links',
    route(async (req) => {
      const { productId, amount, quantity, customerName } = req.body;
      if (!productId) throw badRequest('Pick a product first.');

      // TODO(4) — create a payment link and return mapPaymentLink(link).
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
      throw notImplemented(4);
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
