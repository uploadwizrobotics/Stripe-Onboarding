/* The handlers below are unimplemented, so `stripe`, `CURRENCY`, `LIMIT`,
   `badRequest` and `req` all read as unused. They're the pieces you're about to
   use — delete this line once the TODOs are done and lint should stay quiet. */
/* oxlint-disable no-unused-vars */

import express from "express";
import Stripe from "stripe";

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
export function stripeApi({ secretKey, currency = "cad" }) {
  /* Fail at startup rather than on the first request — a missing or mistyped
     key is the most common setup mistake, and a live key would move real
     money. */
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is missing.\n" +
        "  Copy .env.example to .env and add your Stripe test key.",
    );
  }
  if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("rk_test_")) {
    throw new Error(
      "STRIPE_SECRET_KEY must be a test key (sk_test_… or rk_test_…).\n" +
        "  This app is a sandbox — it will not run against live keys.",
    );
  }

  const stripe = new Stripe(secretKey);
  const CURRENCY = currency.toLowerCase();
  const LIMIT = 50;

  /* ---------------------------- YOUR JOB ---------------------------------- *
   *
   * The six routes below are registered but empty, so every one answers 501
   * and the UI shows an error instead of a store. Your job is to fill them in.
   *
   * Each one is two pieces of work:
   *
   *   1. Call Stripe.          the docs link in each block shows the call
   *   2. Map the response.     Stripe's object into the row the table renders
   *
   * Step 2 is the one people underestimate. A Stripe product has ~25 fields
   * and the table renders six. Work out which six, find where each one lives,
   * and write the function that turns one into the other:
   *
   *     const mapProduct = (product) => ({ id: product.id, ... });
   *
   * A GOOD WAY IN
   *   Do step 1 only: make the Stripe call and return its raw data, no mapping
   *   at all. Open http://localhost:5173/api/products and read what comes back.
   *   Now you know what you're mapping, and you can write step 2 against
   *   something real instead of guessing from the docs. Then repeat.
   *   console.log works too — it prints in your terminal, not the browser,
   *   because this file runs in Node.
   *
   * THE SHAPE TO HIT is in docs/api/standard.md. The components are the real
   * source of truth if you'd rather read those — the tables under src/pages.
   *
   * WATCH FOR
   *   - Amounts are integer cents. Don't divide; formatCurrency does that.
   *   - Nested Stripe objects arrive as id strings unless you expand them. An
   *     id can't tell you an amount, which is where $0.00 prices come from.
   *   - Fee and net aren't on the charge. They're on its balance transaction,
   *     and they're null until it settles.
   *   - Status strings are matched exactly by the UI, capital letter included.
   *   - Stripe timestamps are seconds. JavaScript wants milliseconds.
   * ------------------------------------------------------------------------ */

  const badRequest = (message) =>
    Object.assign(new Error(message), { statusCode: 400 });

  /* ------------------------------ Routes ---------------------------------- */

  const app = express();
  app.use(express.json());

  /**
   * Return a value and it's sent as JSON; throw and it becomes
   * `{ error: message }` with the right status.
   *
   * A handler that returns nothing is one you haven't written yet, so say so
   * plainly. Without this the browser gets an empty 200, JSON.parse chokes on
   * it, and the app dies somewhere in React with a stack trace that points
   * nowhere near the real problem.
   */
  const route = (handler) => async (req, res) => {
    try {
      const payload = await handler(req);

      if (payload === undefined) {
        throw Object.assign(
          new Error(
            `${req.method} ${req.path} isn't built yet — find its TODO in stripe-api.js.`,
          ),
          { statusCode: 501 },
        );
      }

      res.json(payload);
    } catch (error) {
      const status = error.statusCode || 500;
      const message =
        status === 401
          ? "Stripe rejected the API key. Check STRIPE_SECRET_KEY in .env."
          : error.raw?.message ||
            error.message ||
            "Something went wrong talking to Stripe.";

      console.error(`[${req.method} ${req.path}] ${message}`);
      res.status(status).json({ error: message });
    }
  };

  /* ------------------------------------------------------------------------ *
   * SIX ENDPOINTS TO BUILD
   *
   * None of them are written. Each block below is the spec for one; you write
   * the route, the Stripe call, and the mapping.
   *
   * Everything you need is already defined above: `app` is the Express app,
   * `route()` wraps a handler so that returning a value sends it as JSON and
   * throwing sends an error, and `badRequest()` throws a 400. Registering a
   * route is Express as it is anywhere else — a method, a path, a handler.
   *
   * The paths are fixed. src/api/stripeApi.js already fetches them, so they
   * have to match exactly, or the request falls through to the 404 at the
   * bottom of this file. `/api/health` below is a working example of the
   * simplest possible route.
   *
   * Until a handler returns something, its endpoint answers 501 and the app
   * shows you which one it was. That message going away is your progress bar.
   *
   * Build them in order. The first one working proves the whole chain —
   * browser → fetch → Express → Stripe → back — and the rest are variations.
   * ------------------------------------------------------------------------ */

  app.get(
    "/api/products",
    route(async () => {
      // TODO 01 — list the products.
      //   Docs: https://stripe.com/docs/api/products/list
      //
      //   Cap the list at LIMIT, and ask for active products only: archived
      //   ones shouldn't clutter the admin.
      //   `default_price` comes back as an id string unless you expand it, and
      //   the id alone can't tell you the amount. That's the $0.00 bug.
      //   Return an array of product rows.
    }),
  );

  app.get(
    "/api/transactions",
    route(async () => {
      // TODO 02 — list the charges.
      //   Docs: https://stripe.com/docs/api/charges/list
      //
      //   `fee` and `net` are not on the charge. They live on its balance
      //   transaction, which needs expanding, and they stay null until it
      //   settles — render that, don't fake a zero.
      //
      //   The item name is the hard part. A charge from a payment link has no
      //   description; the product name is on the Checkout Session instead
      //   (https://stripe.com/docs/api/checkout/sessions/list — expand its line
      //   items). Both objects point at the same payment_intent, so fetch the
      //   two lists and join them in memory rather than one lookup per row.
      //   Careful: payment_intent is sometimes an id string and sometimes an
      //   expanded object.
      //   Return an array of transaction rows.
    }),
  );

  app.get(
    "/api/payment-links",
    route(async () => {
      // TODO 03 — list the payment links.
      //   Docs: https://stripe.com/docs/api/payment-links/list
      //
      //   Expand the line items: that's where the amount and the product name
      //   are. Don't try to reach through to price.product for the name — on a
      //   list call that path is data.line_items.data.price.product, five
      //   levels deep, and Stripe caps expansion at four. The line item's own
      //   description is already the product name.
      //   The row's amount is unit price × quantity, not unit price.
      //   Return an array of payment-link rows.
    }),
  );

  app.post(
    "/api/products",
    route(async (req) => {
      // TODO 04 — create a product, and a price to go with it.
      //   Docs: https://stripe.com/docs/api/products/create
      //
      //   The form sends { name, blurb, price, sku } on req.body, with price
      //   already in cents. Reject a blank name with badRequest(...) before you
      //   call Stripe.
      //   A product and its price are two objects in Stripe; you can create
      //   both in one call, priced in CURRENCY. The SKU has no field of its
      //   own — Stripe's escape hatch for that is `metadata`.
      //   Return one product row, the same shape the list returns: it goes
      //   straight to the top of the table without a refetch.
    }),
  );

  app.post(
    "/api/payment-links",
    route(async (req) => {
      // TODO 05 — create a payment link.
      //   Docs: https://stripe.com/docs/api/payment-links/create
      //
      //   The modal sends { productId, amount, quantity, customerName }. Reject
      //   a missing productId with badRequest(...).
      //   A link bills a Price, never a product and never a raw number. The
      //   product's default price is usually the one you want — but the modal
      //   lets someone override the amount, and in that case you need to create
      //   a new price first. A product with no price at all is an error worth
      //   its own message.
      //   A payment link has nowhere to put a customer name, so park it in
      //   metadata and read it back out when you map.
      //   Return one payment-link row.
    }),
  );

  app.post(
    "/api/transactions/:chargeId/refund",
    route(async (req) => {
      // TODO 06 — refund a charge. The id arrives as a URL parameter, not a
      // body: it's on req.params, named after the `:chargeId` in the path above.
      //   Docs: https://stripe.com/docs/api/refunds/create
      //
      //   Creating a refund hands back a Refund object, not the charge, and the
      //   copy you already had still says refunded: false. Re-read the charge
      //   so the row you return carries the new status and the settled fee.
      //   Return one transaction row — it replaces the existing row in the
      //   table. There's no checkout session joined in here, so whatever you do
      //   for `item` has to cope with it being absent.
    }),
  );

  /* A worked example — the shape every route above should end up in. */
  app.get("/api/health", (_req, res) => res.json({ ok: true, mode: "test" }));

  /* Anything else under /api is a typo — answer it here rather than letting
     Vite return index.html. */
  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

  return {
    name: "stripe-api",
    configureServer(server) {
      server.middlewares.use(app);
    },
    configurePreviewServer(server) {
      server.middlewares.use(app);
    },
  };
}
