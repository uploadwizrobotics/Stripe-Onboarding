import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { stripeApi } from './stripe-api.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /* Vite only exposes VITE_*-prefixed vars, and only to browser code. The
     third argument is an empty prefix, which loads everything in .env so the
     Node side can read STRIPE_SECRET_KEY. It never reaches the bundle. */
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
