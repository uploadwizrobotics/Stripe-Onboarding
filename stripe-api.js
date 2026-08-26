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

  app.get(
    '/api/products',
    route(async () => {
      const products = await stripe.products.list({
        limit: LIMIT,
        active: true, // archived products stay out of the admin
        expand: ['data.default_price'],
      });
      return products.data.map(mapProduct);
    }),
  );

  app.post(
    '/api/products',
    route(async (req) => {
      const { name, blurb, price, sku } = req.body;
      if (!name?.trim()) throw badRequest('A product name is required.');

      const product = await stripe.products.create({
        name: name.trim(),
        description: blurb?.trim() || undefined,
        active: true, // the admin only lists active products
        metadata: sku?.trim() ? { sku: sku.trim() } : {},
        default_price_data: { currency: CURRENCY, unit_amount: Number(price) || 0 },
        expand: ['default_price'],
      });

      return mapProduct(product);
    }),
  );

  /* A Payment Link charge carries no description — the product name lives on
     the Checkout Session that produced it. Pull both and join on the payment
     intent, rather than a lookup per row. */
  const idOf = (value) => (typeof value === 'string' ? value : value?.id);

  app.get(
    '/api/transactions',
    route(async () => {
      const [charges, sessions] = await Promise.all([
        stripe.charges.list({ limit: LIMIT, expand: ['data.balance_transaction'] }),
        stripe.checkout.sessions.list({ limit: LIMIT, expand: ['data.line_items'] }),
      ]);

      const itemByIntent = new Map(
        sessions.data
          .filter((session) => session.payment_intent)
          .map((session) => [
            idOf(session.payment_intent),
            session.line_items?.data?.[0]?.description,
          ]),
      );

      return charges.data.map((charge) =>
        mapCharge(charge, itemByIntent.get(idOf(charge.payment_intent))),
      );
    }),
  );

  app.post(
    '/api/transactions/:chargeId/refund',
    route(async (req) => {
      await stripe.refunds.create({ charge: req.params.chargeId });

      // Re-read so the response carries the updated status and settled fee.
      const charge = await stripe.charges.retrieve(req.params.chargeId, {
        expand: ['balance_transaction'],
      });
      return mapCharge(charge);
    }),
  );

  app.get(
    '/api/payment-links',
    route(async () => {
      const links = await stripe.paymentLinks.list({
        limit: LIMIT,
        expand: ['data.line_items'],
      });
      return links.data.map(mapPaymentLink);
    }),
  );

  app.post(
    '/api/payment-links',
    route(async (req) => {
      const { productId, amount, quantity, customerName } = req.body;
      if (!productId) throw badRequest('Pick a product first.');

      const product = await stripe.products.retrieve(productId, { expand: ['default_price'] });
      const defaultPrice = product.default_price;

      // The modal allows overriding the amount, so mint a price for this link
      // when it differs from the product's default.
      let priceId = defaultPrice?.id;
      if (amount != null && amount !== defaultPrice?.unit_amount) {
        const price = await stripe.prices.create({
          product: productId,
          currency: CURRENCY,
          unit_amount: Number(amount),
        });
        priceId = price.id;
      }
      if (!priceId) throw badRequest('That product has no price to bill.');

      const link = await stripe.paymentLinks.create({
        line_items: [{ price: priceId, quantity: Math.max(1, Number(quantity) || 1) }],
        metadata: customerName?.trim() ? { customer_name: customerName.trim() } : {},
        expand: ['line_items'],
      });

      return mapPaymentLink(link);
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
