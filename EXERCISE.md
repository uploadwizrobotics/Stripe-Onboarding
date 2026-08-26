# Exercise — wire the admin up to Stripe

The app is finished. The Stripe calls behind it are not.

Everything you need to write lives in **one file: `stripe-api.js`**. There are
six `TODO`s. No React, no CSS, no build config — if a page looks wrong, the
cause is in that file.

## Setup

**1. Install and get a sandbox key**

```bash
npm install
cp .env.example .env
```

In the [Stripe Dashboard](https://dashboard.stripe.com), confirm you're in a
**sandbox** (toggle, top-left), then **Developers → API keys** and copy the
**secret** key — it starts with `sk_test_`. Put it in `.env` as
`STRIPE_SECRET_KEY`.

> Don't rename that variable to `VITE_STRIPE_SECRET_KEY`. Vite compiles
> `VITE_*` values into the browser bundle — that would publish your key to
> anyone who loads the page. Everything you write in `stripe-api.js` runs in
> Node, which is the point.

**2. Run it**

```bash
npm run dev
```

http://localhost:5173. Every page will be empty — that's the starting line.

`stripe-api.js` is part of the Vite config, so **saving it restarts the
server**. Give it a second, then refresh.

## The tasks

Do them in this order — each one gives you something the next needs.

| # | Function | Done when |
|---|---|---|
| 1 | `listProducts` | Products page lists your sandbox products at the right prices |
| 2 | `createProduct` | **Add product** creates one, and it appears in the list |
| 3 | `listPaymentLinks` | Payment links page lists links with the right item and amount |
| 4 | `createPaymentLink` | **New payment link** creates one you can actually open and pay |
| 5 | `listTransactions` | Your test payment appears, with item name, fee and net |
| 6 | `refundTransaction` | **Refund** in the drawer flips the row to Refunded |

Between 4 and 5, take a real test payment: open the link and pay with card
`4242 4242 4242 4242`, any future expiry, any CVC, any postal code.

## How to tell you got it right

The app is the test. Each TODO lists the exact symptom you'll see if it's
almost-but-not-quite right — several of these fail by looking *plausible*
rather than by crashing, which is the part worth practising.

Two ways to see what's actually happening:

- **Terminal** — every failed request logs `[GET /api/products] <message>`
- **Dashboard** — everything you create is real. Open
  [the products page](https://dashboard.stripe.com/test/products) and confirm
  it landed.

You can also hit the API directly, without the UI:

```bash
curl -s localhost:5173/api/products | jq
```

`npm run lint` will warn about three unused variables until TODO(4) is done —
they're destructured for you, waiting to be used. The warnings going away is a
small sign you're on track.

## Rules of thumb

- **Amounts are integer cents.** `$29.00` is `2900`. Every amount crossing this
  file is already in cents — don't convert.
- **Stripe returns ids, not objects.** A charge's `balance_transaction`, a
  product's `default_price` — all ids until you `expand` them. Most of the
  "why is this blank?" moments come from here.
- **Don't touch the `map*` functions.** They're written for you, and they define
  exactly what each call must return. Read them first — they're the spec.
- **Don't fetch in a loop.** Anywhere you need two kinds of object, two list
  calls and a lookup table beat one call per row.

## Stuck

Read the mapper for the thing you're building. `mapCharge` tells you a charge
needs a fee, a net and an item name; that tells you what to go and fetch.

The finished version is one command away:

```bash
git diff main -- stripe-api.js     # the answers
git checkout main                  # the working app
```
