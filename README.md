# Stripe onboarding — Store Admin

A small store admin (products, transactions, payment links) wired to a **Stripe
sandbox**. Built for onboarding: you bring your own test key, and everything you
do here is real Stripe API traffic against fake money.

Nothing here can move real money — the app refuses to start on a live key.

## Shape

A Vite/React frontend and a Node/Express API, running in one process on one
port. The frontend never touches the Stripe SDK; it calls its own API, and the
secret key stays in Node.

```
ProductsPage → StoreProvider → createProduct()      src/api/stripeApi.js
                                    │ POST /api/products
                                    ▼
                        stripe.products.create({ name: 'Gold Plan' })
                                                    stripe-api.js
```

## Setup

**1. Install**

```bash
npm install
```

**2. Get your test key**

In the [Stripe Dashboard](https://dashboard.stripe.com) make sure you're in a
**sandbox** (the toggle top-left), then go to **Developers → API keys** and copy
the **secret** key. It starts with `sk_test_`.

**3. Configure**

```bash
cp .env.example .env
```

Put your key in `.env` as `STRIPE_SECRET_KEY`. That's the only edit.

> No `VITE_` prefix, deliberately. Vite compiles only `VITE_*` variables into
> the browser bundle, so this key stays server-side and can't leak into the
> client.

**4. Run**

```bash
npm run dev
```

One process, one port. Open http://localhost:5173.

## Your job

The API is a shell. `stripe-api.js` has the setup, the error handling, the six
routes and one worked example — but the handlers are empty, so every endpoint
answers `501` and the first thing you'll see is an error, not a store:

```
GET /api/products isn't built yet — find its TODO in stripe-api.js.
```

Filling them in is the point of this repo. Each has a `TODO` block with the
spec, the Stripe docs link, and a warning about the part that bites. Start with
`GET /api/products`; the first one working proves the whole chain.

Read `docs/api/standard.md` first — it has the row shapes you're aiming for.

## Then try the full loop

Once the endpoints are in:

1. **Products → Add product.** It's created in your Stripe sandbox — refresh the
   Dashboard and it's there.
2. **Link** on that row → **Create link**. That's a real Stripe Payment Link.
3. **Open** it, and pay with test card `4242 4242 4242 4242` — any future
   expiry, any CVC, any postal code.
4. **Transactions.** Your payment is in the ledger, with Stripe's actual fee and
   net. Open the row and refund it.

## Scripts

| Command | What |
|---|---|
| `npm run dev` | app + API on one port |
| `npm run build` | production build of the frontend |
| `npm run preview` | serve the build, API included |
| `npm run lint` | oxlint |

## Layout

```
stripe-api.js            the API — Express + the Stripe SDK, mounted into Vite
vite.config.js           React plugin + the API plugin, and the .env read
src/                     React app — inline styles, WIZ Robotics tokens
├── api/                 client.js (fetch) + stripeApi.js (one call per endpoint)
├── components/          shared UI, one folder each
├── hooks/               useDisclosure, useFilters, useSelection, useToast…
├── pages/               products, transactions, payment-links
├── store/               StoreProvider — fetches and holds the data
├── styles/              theme.js + global.css + tokens/
└── utils/               config, currency, dates
design/                  source design canvases (not built)
docs/api/standard.md     how the two halves fit, and how to add an endpoint
```

## Notes

- **Endpoints live in `stripe-api.js`.** Every call is the same SDK and the same
  method names as the Stripe docs. See `docs/api/standard.md` for how to add
  one.
- **Stripe field names stop at the server.** Routes must return rows already
  mapped for the tables — no `unit_amount` or `balance_transaction` in React.
- **Sold count** is derived by matching charge descriptions to product names —
  Stripe has no per-product sales counter.
- **Payment link status** is Stripe's `active` flag, not paid/unpaid. A link can
  be paid many times.
- **Paying** happens on Stripe's hosted page, which is why the action is
  **Open** rather than a pay button.
# Stripe-Onboarding
