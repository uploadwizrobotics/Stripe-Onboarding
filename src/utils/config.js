/* Client config, read from import.meta.env (see .env.example).
   Everything here ships in the browser bundle — public by definition.
   The secret key is deliberately absent: it lives in Node, in stripe-api.js. */

const env = import.meta.env;

export const config = {
  /* Display only. The currency products are actually priced in is
     STRIPE_CURRENCY, on the server — keep the two in step. */
  currency: (env.VITE_CURRENCY || 'CAD').toUpperCase(),
  locale: env.VITE_LOCALE || 'en-CA',
  /* Env vars are always strings — compare, don't coerce. */
  isTestMode: env.VITE_TEST_MODE !== 'false',
};
