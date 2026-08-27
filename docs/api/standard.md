# API

Two halves, one process.

```
src/api/stripeApi.js   browser  →  createProduct()          one fetch, no SDK
        ↓ POST /api/products
stripe-api.js          Node     →  stripe.products.create()  the real call
```

`stripe-api.js` is an Express app returned as a Vite plugin, so `npm run dev`
serves the React app and the API on the same port. Same-origin: no CORS, no
proxy config, no second terminal.

**The secret key never leaves Node.** `STRIPE_SECRET_KEY` has no `VITE_` prefix,
and Vite only inlines `VITE_*` variables into the browser bundle — so it can't
leak into the client even by accident. `vite.config.js` reads it with
`loadEnv(mode, process.cwd(), '')` and hands it to the plugin.

## Reading the Stripe docs

Every example at [stripe.com/docs/api](https://stripe.com/docs/api) drops
straight into `stripe-api.js`. The docs show CommonJS with the key inline:

```js
const stripe = require('stripe')('sk_test_51Qp...');
const product = await stripe.products.create({ name: 'Gold Plan' });
```

This project is ESM with the key in `.env`, so the setup is:

```js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const product = await stripe.products.create({ name: 'Gold Plan' });
```

Only the setup lines differ. Method names, arguments and response shapes are
exactly what the docs say.

## Exercise: the mapping

The routes in `stripe-api.js` return Stripe's raw objects right now, so the UI
is broken — $0.00 prices, blank names, filter chips that match nothing. Writing
the mapping is the exercise.

A Stripe object has dozens of fields; a table row has six. Work out which ones,
find where each lives, and write the function that converts one to the other.
Inspect the raw JSON at `http://localhost:5173/api/products` (and
`/api/transactions`, `/api/payment-links`) while `npm run dev` is running.

These are the shapes to hit. Every key is read by a component, so a missing one
renders as blank or `NaN`.

**Product row** — rendered by `ProductTable`, and by `NewLinkModal`'s dropdown

| Key | Type | Notes |
|---|---|---|
| `id` | string | |
| `name` | string | |
| `blurb` | string | `''` when absent, not `null` |
| `sku` | string | lives in metadata; `''` when absent |
| `price` | number | **integer cents**, `0` when there's no price |
| `status` | string | `'Active'` or `'Draft'` |

`initials` and `sold` are added afterwards by `StoreProvider` — don't map those.

**Transaction row** — `TransactionTable` and `TransactionDrawer`

| Key | Type | Notes |
|---|---|---|
| `id` | string | |
| `customer` | string | falls back to `'Guest checkout'` |
| `email` | string | `'—'` when absent |
| `item` | string | the product name, pre-joined for you on the list route |
| `gross` | number | integer cents |
| `fee` | number \| null | **null until the balance transaction settles** |
| `net` | number \| null | same |
| `status` | string | `'Succeeded'`, `'Refunded'`, `'Failed'`, `'Pending'` |
| `date` | string | ISO 8601. Stripe gives you seconds, not milliseconds |
| `card` | string | e.g. `'visa · 4242'` |

The status strings are matched exactly — `TX_FILTERS` in `src/utils/constants.js`
lowercases them for the filter chips. Note that a refunded charge still has
`status: 'succeeded'` on the Stripe object; the refund is a separate flag.

**Payment link row** — `PaymentLinkTable`

| Key | Type | Notes |
|---|---|---|
| `id` | string | |
| `url` | string | the hosted checkout URL |
| `item` | string | from the line item, not the product |
| `amount` | number | integer cents, and it's **unit price × quantity** |
| `customer` | string | you stored it in metadata on create |
| `status` | string | `'Active'` or `'Inactive'` |

You'll know it's right when every column fills in, the transaction filters work,
and creating a product puts a complete row at the top of the table without a
refresh.

## Adding a call

**1. A route in `stripe-api.js`.** Wrap the handler in `route()`: return a value
and it's sent as JSON, throw and it becomes `{ error: message }` with the right
status.

```js
app.post(
  '/api/products/:id/archive',
  route(async (req) => {
    const product = await stripe.products.update(req.params.id, { active: false });
    return mapProduct(product); // reuse the mapper — never return a raw Stripe object
  }),
);
```

Validate input with `badRequest('…')` — it throws a 400 with your message.

**2. A function in `src/api/stripeApi.js`.** One line, no SDK:

```js
export function archiveProduct(id) {
  return request(`/products/${id}/archive`, { method: 'POST' });
}
```

**3. Call it from `StoreProvider`** (or a page). It throws on failure; catch and
show `err.message`.

## Conventions

| | |
|---|---|
| **Routes** | `/api/<plural-noun>`, REST verbs; actions are a sub-path (`/…/:id/refund`) |
| **Functions** | camelCase verbs mirroring the route: `listProducts`, `createPaymentLink` |
| **Amounts** | integer cents end to end. Format only at render, via `formatCurrency` |
| **Mapping** | Stripe field names stop at `stripe-api.js`. Routes return mapped rows, never raw Stripe objects — nothing in React knows what a balance transaction is |
| **Errors** | throw inside `route()`; it logs and returns `{ error }`. 401 is rewritten to a message about the key |
| **Secrets** | anything named `VITE_*` is public. The key is not, and must never be |
