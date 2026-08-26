import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { stripeApi } from './stripe-api.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /* The '' prefix loads every variable, not just VITE_* ones — that's how the
     secret key reaches the plugin without reaching the browser bundle. */
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      stripeApi({
        secretKey: env.STRIPE_SECRET_KEY,
        currency: env.STRIPE_CURRENCY,
      }),
    ],
  };
});
