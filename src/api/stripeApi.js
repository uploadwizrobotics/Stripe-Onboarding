import { request } from './client';

/**
 * The browser side of the API.
 *
 * Each function calls the API you build in `stripe-api.js` (see TODO(A) in
 * vite.config.js) and returns whatever it sends back. `request()` in
 * ./client.js already handles method, JSON encoding and errors — it throws on
 * any non-2xx, and callers up in src/store/StoreProvider.jsx catch that and
 * show the message. So these are one-liners; the work is picking the right
 * path, method and body.
 *
 * `request(path, { method, body })`
 *   path    appended to /api — so '/products' hits /api/products
 *   method  defaults to 'GET'
 *   body    a plain object, JSON-encoded for you. Omit it on GETs
 *
 * Amounts are integer cents in both directions. Never send dollars.
 */

const notImplemented = (n, name) => {
  throw new Error(`${name} not implemented — see TODO(${n}) in src/api/stripeApi.js`);
};

/**
 * TODO(1) — GET every product.
 * Resolves to an array of product rows.
 */
export const listProducts = () => notImplemented(1, 'listProducts');

/**
 * TODO(2) — POST a new product, resolving to the created row.
 * Send: name, blurb, price (cents), sku
 */
export const createProduct = ({ name, blurb, price, sku }) =>
  notImplemented(2, 'createProduct');

/**
 * TODO(3) — GET every transaction.
 * Resolves to an array of transaction rows.
 */
export const listTransactions = () => notImplemented(3, 'listTransactions');

/**
 * TODO(4) — POST a refund for one charge, resolving to the updated row.
 * The charge id belongs in the path, not the body — there's nothing else to
 * send.
 */
export const refundTransaction = (chargeId) =>
  notImplemented(4, 'refundTransaction');

/**
 * TODO(5) — GET every payment link.
 * Resolves to an array of payment link rows.
 */
export const listPaymentLinks = () => notImplemented(5, 'listPaymentLinks');

/**
 * TODO(6) — POST a new payment link, resolving to the created row.
 * Send: productId, amount (cents, per unit), quantity, customerName
 */
export const createPaymentLink = ({ productId, amount, quantity, customerName }) =>
  notImplemented(6, 'createPaymentLink');
