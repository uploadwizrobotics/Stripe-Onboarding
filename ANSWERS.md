# Answers

A walkthrough of the exercise. Each step says which file to open, what to put
in it, and what should change on screen once you have.

Work top to bottom — the file gets built up as you go. If you only want to
check one answer, jump to its step; every code block is self-contained.

---

## Step 1 — stand up the API

### 1a. Create the file

**File:** `stripe-api.js` — new, in the repo root, next to `vite.config.js`

```js
import express from 'express';
import Stripe from 'stripe';

/**
 * The Stripe API, mounted inside Vite's dev server.
 *
 * This runs in Node, not the browser — which is the whole point. The secret key
 * stays on this side, and the React app just calls /api/… on its own origin.
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

  /* ---- MAPPERS GO HERE (steps 2a, 4a, 7a) ---- */

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

  /* ---- ROUTES GO HERE (steps 2b, 3, 4b, 5, 7b, 8) ---- */

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
```

Those two `/* ---- ... ---- */` markers are where later steps go. Leave them.

### 1b. Mount it

**File:** `vite.config.js`

Add the import at the top:

```js
import { stripeApi } from './stripe-api.js';
```

Then replace the whole `TODO(A)` comment block inside `plugins: [...]` with:

```js
      stripeApi({
        secretKey: env.STRIPE_SECRET_KEY,
        currency: env.STRIPE_CURRENCY,
      }),
```

### What you should see

Restart isn't needed — saving the config restarts Vite itself. Give it a
second, then:

```bash
curl -s localhost:5173/api/health
```

```json
{"ok":true,"mode":"test"}
```

Before this it returned a page of HTML. **The pages still show errors** — that's
correct, the endpoints don't exist yet.

If Vite refuses to start, read the message: it's the key check doing its job.

---

## Step 2 — list products

### 2a. The mapper

**File:** `stripe-api.js`, at the `MAPPERS GO HERE` marker

```js
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
```

`hasPrice` is the guard that matters: `default_price` arrives as an id string
unless the call expands it, and `'price_1abc'.unit_amount` is `undefined`.

### 2b. The endpoint

**File:** `stripe-api.js`, at the `ROUTES GO HERE` marker

```js
  app.get(
    '/api/products',
    route(async () => {
      const products = await stripe.products.list({
        limit: LIMIT,
        active: true,
        expand: ['data.default_price'],
      });
      return products.data.map(mapProduct);
    }),
  );
```

`active: true` filters out archived products. `expand` is what turns
`default_price` from an id into the object the mapper reads.

### 2c. The fetch wrapper

**File:** `src/api/stripeApi.js` — replace the `TODO(1)` stub

```js
export const listProducts = () => request('/products');
```

### What you should see

**Products** page: your sandbox products, with real prices, SKUs and Active
chips. The sidebar count next to *Products* fills in.

Sold reads 0 for everything — that's derived from transactions, which you
haven't built yet.

If every price shows **$0.00**, you dropped the `expand`. If dozens of
unfamiliar products appear, you dropped `active: true`.

---

## Step 3 — create a product

### 3a. The endpoint

**File:** `stripe-api.js`, at the `ROUTES GO HERE` marker

```js
  app.post(
    '/api/products',
    route(async (req) => {
      const { name, blurb, price, sku } = req.body;
      if (!name?.trim()) throw badRequest('A product name is required.');

      const product = await stripe.products.create({
        name: name.trim(),
        description: blurb?.trim() || undefined,
        active: true,
        metadata: sku?.trim() ? { sku: sku.trim() } : {},
        default_price_data: { currency: CURRENCY, unit_amount: Number(price) || 0 },
        expand: ['default_price'],
      });

      return mapProduct(product);
    }),
  );
```

`default_price_data` is the shortcut: a product and a price are separate objects
in Stripe, and this creates both in one call.

### 3b. The fetch wrapper

**File:** `src/api/stripeApi.js` — replace the `TODO(2)` stub

```js
export const createProduct = ({ name, blurb, price, sku }) =>
  request('/products', { method: 'POST', body: { name, blurb, price, sku } });
```

### What you should see

**Add product** → fill in a name and a price → **Save product**. The modal
closes, a toast says *"<name> added"*, and the row appears at the top of the
table with the price you typed. It's real: it shows up in the
[Stripe Dashboard](https://dashboard.stripe.com/test/products) too.

---

## Step 4 — list payment links

### 4a. The mapper

**File:** `stripe-api.js`, at the `MAPPERS GO HERE` marker

```js
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
```

### 4b. The endpoint

**File:** `stripe-api.js`, at the `ROUTES GO HERE` marker

```js
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
```

**This is the 4-level trap.** Reaching the product's name looks like it needs
`data.line_items.data.price.product` — five levels, and Stripe rejects it:

```
You cannot expand more than 4 levels of a property.
```

You don't need to. The line item's own `description` is already the product
name, so `data.line_items` is enough.

### 4c. The fetch wrapper

**File:** `src/api/stripeApi.js` — replace the `TODO(5)` stub

```js
export const listPaymentLinks = () => request('/payment-links');
```

### What you should see

**Payment links** page: any links already in your sandbox, with item, amount
and an Active chip. Empty is fine if you've never made one — step 5 fixes that.

---

## Step 5 — create a payment link

### 5a. The endpoint

**File:** `stripe-api.js`, at the `ROUTES GO HERE` marker

```js
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
```

The awkward part is real: a payment link bills a **Price**, not a number. If
someone types an amount that doesn't match the product's default price, no such
Price exists yet — so you create one, then bill it.

`customer_name` goes in metadata because a payment link has nowhere else to put
it. That's exactly where `mapPaymentLink` reads it back from.

### 5b. The fetch wrapper

**File:** `src/api/stripeApi.js` — replace the `TODO(6)` stub

```js
export const createPaymentLink = ({ productId, amount, quantity, customerName }) =>
  request('/payment-links', {
    method: 'POST',
    body: { productId, amount, quantity, customerName },
  });
```

### What you should see

**New payment link** → pick a product → **Create link**. Toast says *"Payment
link created"*, and the row appears with a real `buy.stripe.com/test_…` URL.

**Copy** puts it on your clipboard and flips to *Copied*. **Open** launches
Stripe's hosted checkout in a new tab — a real page, with your product name and
amount on it.

---

## Step 6 — pay it

No code. Open the link and pay:

| | |
|---|---|
| card | `4242 4242 4242 4242` |
| expiry | any future date |
| CVC | any 3 digits |
| postal code | anything |

You'll land on a success page. Nothing changes in the admin yet — that's step 7.

Do this before step 7 or there'll be nothing to list.

---

## Step 7 — list transactions

### 7a. The mapper

**File:** `stripe-api.js`, at the `MAPPERS GO HERE` marker

```js
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
      fee: settled ? balance.fee : null,
      net: settled ? balance.net : null,
      status,
      date: new Date(charge.created * 1000).toISOString(),
      card: card ? `${card.brand} · ${card.last4}` : '—',
    };
  };
```

Three things worth noticing:

- **`charge.refunded` is checked first.** A refunded charge still reports
  `status: 'succeeded'`, so testing `status` first means nothing ever shows as
  Refunded.
- **`* 1000`.** Stripe counts seconds; JS Dates want milliseconds.
- **`null`, not `0`.** The table prints `—` for null. Zero would claim Stripe
  took no fee.

### 7b. The endpoint

**File:** `stripe-api.js`, at the `ROUTES GO HERE` marker

```js
  app.get(
    '/api/transactions',
    route(async () => {
      const idOf = (value) => (typeof value === 'string' ? value : value?.id);

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
```

**Why two calls.** A charge made through a payment link has no `description` —
the product name lives on the Checkout Session that produced it. Both objects
point at the same payment intent, so that's the join key. Fetching both lists
once and matching in memory beats a lookup per row.

`idOf` exists because `payment_intent` comes back as an id string on one call
and as an object on the other.

### 7c. The fetch wrapper

**File:** `src/api/stripeApi.js` — replace the `TODO(3)` stub

```js
export const listTransactions = () => request('/transactions');
```

### What you should see

**Transactions**: the payment you made in step 6, with the product name under
Item, a **Succeeded** chip, and Stripe's real numbers — on a $5.00 charge,
`$0.49` fee and `$4.51` net.

Click the row: the drawer opens with the card, the email, and a timeline.

Back on **Products**, Sold is now 1 for whatever you bought — that count is
derived from this data.

If Fee and Net show **—**, you dropped the `balance_transaction` expand. If
Item shows **—**, you skipped the sessions join.

---

## Step 8 — refund

### 8a. The endpoint

**File:** `stripe-api.js`, at the `ROUTES GO HERE` marker

```js
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
```

Creating a refund hands you back a Refund, not the charge — and the copy you
already had still says `refunded: false`. Re-read it, or the row won't change
until a reload.

### 8b. The fetch wrapper

**File:** `src/api/stripeApi.js` — replace the `TODO(4)` stub

```js
export const refundTransaction = (chargeId) =>
  request(`/transactions/${chargeId}/refund`, { method: 'POST' });
```

### What you should see

Open a Succeeded transaction and click **Refund $X.XX**. The drawer closes, a
toast says *"Refund issued"*, and the row's chip flips to **Refunded** without a
reload. The **Refunded** filter now returns it.

---

## Done

All nine pieces in place:

```bash
npm run lint     # the unused-variable warnings should be gone
git diff main    # should show nothing meaningful in the three files
```

If you want to compare against the reference implementation directly:

```bash
git diff main -- stripe-api.js vite.config.js src/api/stripeApi.js
```
