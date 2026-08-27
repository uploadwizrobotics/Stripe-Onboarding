import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /* The '' prefix loads EVERY variable, not just VITE_* ones. That matters:
     Vite compiles VITE_*-prefixed values into the browser bundle, so a Stripe
     secret key must NOT carry that prefix. Read it here, in Node, and hand it
     to your plugin — never let it reach the client. */
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),

      // ─────────────────────────────────────────────────────────────────────
      // TODO(A) — build the API and mount it here
      //
      // Nothing serves /api yet, which is why every page shows an error.
      //
      // Create `stripe-api.js` in this folder, exporting a function that
      // returns a Vite plugin:
      //
      //   export function stripeApi({ secretKey, currency }) {
      //     return {
      //       name: 'stripe-api',
      //       configureServer(server) { server.middlewares.use(app) },
      //       configurePreviewServer(server) { server.middlewares.use(app) },
      //     };
      //   }
      //
      // `app` is an Express app — express and stripe are already installed.
      // Vite's middleware stack is connect-compatible, so an Express app
      // mounts straight into it, and /api ends up on the same port as the
      // React app: no proxy, no CORS.
      //
      // Then import it above and add it to this array:
      //
      //   stripeApi({
      //     secretKey: env.STRIPE_SECRET_KEY,
      //     currency: env.STRIPE_CURRENCY,
      //   })
      //
      // The six endpoints it needs to answer are listed in EXERCISE.md.
      // Docs: https://vite.dev/guide/api-plugin#configureserver
      // ─────────────────────────────────────────────────────────────────────
    ],
  };
});
