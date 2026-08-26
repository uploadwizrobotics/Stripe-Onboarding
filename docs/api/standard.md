# API

There's no separate backend. The Stripe API lives in `stripe-api.js`, mounted
into Vite's dev server as a plugin — so `npm run dev` serves the React app and
the API on the same port, from one process.

## Why any server-side code at all?

Listing products, listing charges, creating payment links and refunding all
require the **secret** key.

Stripe does allow these calls from a browser — `api.stripe.com` returns
permissive CORS headers, so a fetch with `Authorization: Bearer sk_test_…`
would genuinely work. The reason we don't:

- Anything the browser can read, every visitor can read. A leaked `sk_test_`
  key means someone can create and delete objects in your sandbox.
- More importantly it's a habit that costs real money the first time someone
  swaps in a live key.

So the key stays in Node. The browser only ever talks to `/api/…` on its own
origin.

The publishable key is browser-safe but unlocks only a narrow set of endpoints
(Stripe.js / Elements). This app doesn't need it — checkout happens on Stripe's
hosted Payment Link page.

## Layout

```
stripe-api.js      the Stripe client, key validation, mapping, and all routes
vite.config.js     passes STRIPE_SECRET_KEY in and mounts the plugin
src/api/           the browser side: fetch wrapper + one function per endpoint
```

## Adding a route

Add it to `stripe-api.js`. Wrap the handler in `route()` — return a value and
it's sent as JSON, throw and it becomes `{ error: message }` with the right
status.

```js
app.post(
  '/api/products/:id/archive',
  route(async (req) => {
    const product = await stripe.products.update(req.params.id, { active: false });
    return mapProduct(product);
  }),
);
```

Then add the matching function in `src/api/stripeApi.js`:

```js
export const archiveProduct = (id) =>
  request(`/products/${id}/archive`, { method: 'POST' });
```

For a validation failure, `throw badRequest('...')` — a 400 before Stripe is
ever called.

Editing `stripe-api.js` restarts the Vite server, since it's part of the config.

## Conventions

| | |
|---|---|
| **Paths** | kebab-case, plural: `/api/payment-links`, `/api/transactions/:id/refund` |
| **Functions** | camelCase verbs: `listProducts`, `createPaymentLink` |
| **Amounts** | integer cents everywhere, both directions. Format only at render, via `formatCurrency` |
| **Mapping** | Stripe field names never reach React — map them in `stripe-api.js` |
| **Errors** | `{ error: message }`, written for whoever is setting the repo up |
| **Frontend** | `request()` throws on non-2xx; callers catch and show `err.message` |

## Secrets

`STRIPE_SECRET_KEY` has **no `VITE_` prefix**, and that's what keeps it safe:
Vite only compiles `VITE_*` variables into the browser bundle. `loadEnv(mode,
cwd, '')` in `vite.config.js` reads it in Node and hands it to the plugin.

Renaming it to `VITE_STRIPE_SECRET_KEY` would publish it to every visitor.

The plugin refuses to start on a non-test key, so a live key can't run this app
by accident.
