/* Client config, read from import.meta.env (see .env.example).
   Everything here ships in the browser bundle — public by definition. */

const env = import.meta.env;

export const config = {
  apiUrl: env.VITE_API_URL || '/api',
  /* Keep in step with STRIPE_CURRENCY in .env — this only controls
     how amounts are displayed, Stripe decides what's actually charged. */
  currency: (env.VITE_CURRENCY || 'CAD').toUpperCase(),
  locale: env.VITE_LOCALE || 'en-CA',
  /* Env vars are always strings — compare, don't coerce. */
  isTestMode: env.VITE_TEST_MODE !== 'false',
};
