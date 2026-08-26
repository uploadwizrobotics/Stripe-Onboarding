# Stripe onboarding — Store Admin

A small store admin (products, transactions, payment links) wired to a **Stripe
sandbox**. Built for onboarding: you bring your own test key, and everything you
do here is real Stripe API traffic against fake money.

Nothing here can move real money — the app refuses to start on a live key.

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

> Leave the name exactly as it is. Vite compiles `VITE_*` variables into the
> browser bundle — renaming it to `VITE_STRIPE_SECRET_KEY` would publish your
> key to everyone who loads the page.

**4. Run**

```bash
npm run dev
```

One process, one port. Open http://localhost:5173.

## Try the full loop

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
stripe-api.js            the Stripe API — runs in Node, inside Vite
vite.config.js           passes the secret key in, mounts the API
src/                     React app — inline styles, WIZ Robotics tokens
├── api/                 fetch wrapper + one function per endpoint
├── components/          shared UI, one folder each
├── hooks/               useDisclosure, useFilters, useSelection, useToast…
├── pages/               products, transactions, payment-links
├── store/               StoreProvider — fetches and holds Stripe data
├── styles/              theme.js + global.css + tokens/
└── utils/               config, currency, dates
design/                  source design canvases (not built)
docs/api/standard.md     why the API is server-side, how to add an endpoint
```

## Notes

- **There's no separate backend.** `stripe-api.js` is a Vite plugin, so the API
  and the app share a port and a process. Editing it restarts the dev server.
- **The secret key never reaches the browser** — it has no `VITE_` prefix, so
  Vite leaves it in Node. See `docs/api/standard.md`.
- **Sold count** is derived by matching charge descriptions to product names —
  Stripe has no per-product sales counter.
- **Payment link status** is Stripe's `active` flag, not paid/unpaid. A link can
  be paid many times.
- **Paying** happens on Stripe's hosted page, which is why the action is
  **Open** rather than a pay button.
