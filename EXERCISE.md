# Exercise — wire the admin up to Stripe

The app is finished. Nothing behind it is.

Everything you write lives in **one file: `stripe-api.js`** — nine `TODO`s. No
React, no CSS, no build config. If a page looks wrong, the cause is in that
file.

Two jobs, alternating:

1. **Fetch it from Stripe** — get the right objects back, with the right fields
   filled in.
2. **Shape it into a row** — turn a Stripe object into exactly what the table
   renders.

The tables are already written and you don't change them. That makes them your
spec: `ProductTable.jsx` reads `p.price`, so `mapProduct` has to produce
`price`. Read the table, then write the mapper, then write the call that feeds
it.

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

Do them in order — each gives you something the next one needs.

| # | Function | Done when |
|---|---|---|
| 1 | `mapProduct` | — (nothing visible yet; TODO(2) proves it) |
| 2 | `listProducts` | Products page lists your sandbox products at the right prices |
| 3 | `createProduct` | **Add product** creates one, and it appears in the list |
| 4 | `mapPaymentLink` | — |
| 5 | `listPaymentLinks` | Payment links page shows links with the right item and amount |
| 6 | `createPaymentLink` | **New payment link** creates one you can open and pay |
| 7 | `mapCharge` | — |
| 8 | `listTransactions` | Your test payment appears, with item name, fee and net |
| 9 | `refundTransaction` | **Refund** in the drawer flips the row to Refunded |

A mapper on its own shows you nothing — it's the list call right after it that
puts rows on screen. Expect to go back and fix the mapper once you can see it.

**Between 6 and 8, take a real test payment.** Open the link you just made and
pay with card `4242 4242 4242 4242`, any future expiry, any CVC, any postal
code. Without that there's nothing for TODO(8) to list.

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
- **Don't touch anything outside `stripe-api.js`.** The tables, the store and
  the components are done. If a column is empty, the fix is in your mapper or
  your call — never in the table.
- **Don't fetch in a loop.** Anywhere you need two kinds of object, two list
  calls and a lookup table beat one call per row.

## Stuck

Work backwards from the table. The Transactions table renders a Fee column, so
`mapCharge` has to return `fee`, so the call feeding it has to fetch something
that carries a fee. That chain — column, mapper, call — answers most of these.

Then check the terminal. A thrown Stripe error is usually specific about which
parameter it didn't like.

The finished version is one command away:

```bash
git diff main -- stripe-api.js     # the answers
git checkout main                  # the working app
```
