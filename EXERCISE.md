# Exercise — give the admin a Stripe backend

The frontend is finished and you don't change it. Pages, tables, modals, the
drawer, the store — all working, all waiting for data that never arrives.

Everything behind them is yours to write.

```
GIVEN    src/                    React app: pages, tables, store, styling
         vite.config.js          the app builds and runs
         .env.example            what config is needed

YOURS    stripe-api.js           ← doesn't exist yet. Create it
         src/api/stripeApi.js    ← six stubs to fill in
```

Run it now and every page shows an error naming the function to go write. That
is the starting line.

## Setup

```bash
npm install
cp .env.example .env
```

In the [Stripe Dashboard](https://dashboard.stripe.com), confirm you're in a
**sandbox** (toggle, top-left), then **Developers → API keys** and copy the
**secret** key — it starts with `sk_test_`. Put it in `.env` as
`STRIPE_SECRET_KEY`.

> Don't give it a `VITE_` prefix. Vite compiles `VITE_*` values into the
> browser bundle — that prefix would publish your key to everyone who loads the
> page. Keeping it out of the browser is the whole reason the API exists.

```bash
npm run dev
```

http://localhost:5173

## The shape of it

The browser never talks to Stripe. It calls your API on its own origin, and
your API talks to Stripe with the secret key:

```
React  →  /api/products  →  your Express app  →  Stripe
          (same port)       (in Node)
```

`express` and `stripe` are already installed. You mount Express inside Vite's
dev server as a plugin, so there's no second process, no proxy and no CORS.

## Reading the Stripe docs

Every method you need is documented at
[stripe.com/docs/api](https://stripe.com/docs/api), and the examples there are
copy-pasteable once you know the one translation.

The docs show CommonJS with the key inline:

```js
const stripe = require('stripe')('sk_test_51Qp...');
const product = await stripe.products.create({ name: 'Gold Plan' });
```

This project is ESM, and the key lives in `.env`:

```js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const product = await stripe.products.create({ name: 'Gold Plan' });
```

Only the first two lines differ. Everything after `stripe.` — method names,
arguments, response shape — is exactly what the docs say.

### Try calls before you wire them

`scratch.js` is a playground for exactly this. Paste an example from the docs,
run it, look at what comes back:

```bash
npm run scratch
```

It starts with `products.list` run twice — once plain, once with `expand` — so
you can see `default_price` change from an id string into an object. That one
difference is behind most of the "why is this blank?" moments in this exercise.

Anything you create in there is real and lands in your Dashboard. Work a call
out in `scratch.js` first, then move the version that worked into the app.

## Part A — stand up the API

`vite.config.js` has **TODO(A)**, which sketches the plugin and where it mounts.

Done when `curl localhost:5173/api/health` answers instead of returning the
React app's HTML.

## Part B — the six endpoints

| Method | Path | Returns |
|---|---|---|
| GET | `/api/products` | array of product rows |
| POST | `/api/products` | the created product row |
| GET | `/api/transactions` | array of transaction rows |
| POST | `/api/transactions/:chargeId/refund` | the updated transaction row |
| GET | `/api/payment-links` | array of payment link rows |
| POST | `/api/payment-links` | the created payment link row |

On failure, answer with the upstream status and `{ error: "message" }` —
`src/api/client.js` reads `error` and the UI shows it verbatim, so write those
messages for a human.

### What a "row" is

This is the part worth getting exactly right: **the tables are the spec.**
Each one reads specific fields off each row, so your job is to turn a Stripe
object into precisely this shape. Open the component if you want to see it.

**Product row** — `src/pages/products/components/ProductTable.jsx`

| field | |
|---|---|
| `id` | Stripe product id |
| `name` | the product's name |
| `blurb` | its description, `''` when absent |
| `sku` | `metadata.sku`, `''` when absent |
| `price` | the default price's amount, in **cents**. `0` if there's no price |
| `status` | `'Active'` or `'Draft'` |

(`initials` and `sold` are derived in `src/store/StoreProvider.jsx` — not yours.)

**Transaction row** — `TransactionTable.jsx` and `TransactionDrawer.jsx`

| field | |
|---|---|
| `id` | Stripe charge id |
| `customer` | billing name, `'Guest checkout'` when absent |
| `email` | billing email, `'—'` when absent |
| `item` | what was bought — see the note below |
| `gross` | charge amount, in cents |
| `fee` | Stripe's fee, in cents, or `null` |
| `net` | what you keep, in cents, or `null` |
| `status` | `'Succeeded'` \| `'Refunded'` \| `'Failed'` \| `'Pending'` |
| `date` | an ISO string |
| `card` | e.g. `'visa · 4242'`, `'—'` when absent |

**Payment link row** — `PaymentLinkTable.jsx`

| field | |
|---|---|
| `id` | Stripe payment link id |
| `url` | the checkout URL |
| `item` | what's being sold |
| `amount` | total in cents: unit amount × quantity |
| `customer` | the name you stored in metadata, `'—'` when absent |
| `status` | `'Active'` or `'Inactive'` |

Those `status` strings are exact. They drive both the chip colour and the
filter buttons — see `STATUS_CHIP` in `src/styles/theme.js`. A chip that
renders grey when you expected green means you spelled one differently.

## Part C — the six fetch wrappers

`src/api/stripeApi.js`, **TODO(1)** through **TODO(6)**. One line each once the
endpoints exist.

## Order to work in

Each step gives you something the next one needs.

| | Step | Done when |
|---|---|---|
| 1 | TODO(A) — the plugin | `/api/health` answers |
| 2 | `GET /api/products` + TODO(1) | Products page lists your sandbox products at the right prices |
| 3 | `POST /api/products` + TODO(2) | **Add product** creates one and it appears |
| 4 | `GET /api/payment-links` + TODO(5) | Payment links page shows links with the right item and amount |
| 5 | `POST /api/payment-links` + TODO(6) | **New payment link** creates one you can open and pay |
| 6 | *take a test payment* | card `4242 4242 4242 4242`, any future expiry, any CVC, any postal code |
| 7 | `GET /api/transactions` + TODO(3) | the payment appears, with item name, fee and net |
| 8 | `POST .../refund` + TODO(4) | **Refund** in the drawer flips the row to Refunded |

Step 6 isn't optional — without a real payment there's nothing for step 7 to
list.

## Things that will catch you out

Each of these fails by looking *plausible* rather than by crashing, which is
the part worth practising.

- **Stripe returns ids, not objects.** A product's `default_price`, a charge's
  `balance_transaction` — all id strings until you `expand` them. Most
  "why is this blank?" moments start here.
  → *prices all render $0.00*, or *Fee and Net show —*
- **Archived records come back by default.** Filter them out.
  → *dozens of products you've never seen*
- **`expand` caps at 4 levels**, and on a list call every path already starts
  with `data.`. Count the dots when Stripe rejects one.
- **Amounts are integer cents.** `$29.00` is `2900`. Everything crossing your
  API is already in cents — don't convert.
- **Stripe counts seconds since the epoch.** JS Dates want milliseconds.
- **A refunded charge still reports its own status as `succeeded`.** Check the
  refunded flag first, or nothing ever shows as Refunded.
- **A payment link charge has no description.** The product name lives on the
  Checkout Session that produced it; both reference the same payment intent.
  Two list calls and a lookup table — not one call per row.
  → *Item column shows —, and Sold stays 0*
- **A payment link bills a Price, not a number.** If someone overrides the
  amount, you need a price that matches it before you can create the link.

## Checking your work

The app is the test. Beyond that:

- **Terminal** — log failures in your handler; Stripe's errors usually name the
  parameter it didn't like
- **Dashboard** — everything you create is real. Check
  [products](https://dashboard.stripe.com/test/products) and
  [payments](https://dashboard.stripe.com/test/payments)
- **Straight at the API**, no UI in the way:

```bash
curl -s localhost:5173/api/products | jq
```

`vite.config.js` and `stripe-api.js` are part of the Vite config, so **saving
either restarts the server**. Give it a second, then refresh.

`npm run lint` reports ~11 unused-variable warnings on the untouched template —
`env`, `request`, and every stub's parameters, all waiting to be used. Nothing
is broken. They disappear as you implement, so the count dropping is a rough
progress bar.

## Answers

```bash
git diff main -- stripe-api.js vite.config.js src/api/stripeApi.js
git checkout main      # the finished app
```
