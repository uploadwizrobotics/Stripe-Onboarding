import { request } from './client';

/**
 * The frontend's view of the API.
 *
 * No Stripe SDK, no secret key — this is browser code. Every function here is
 * one HTTP call to the Node side (`stripe-api.js` at the repo root), which is
 * where `stripe.products.create(…)` and friends actually run.
 *
 *     ProductsPage → StoreProvider → createProduct()   ← you are here
 *                                        │  POST /api/products
 *                                        ▼
 *                    stripe-api.js → stripe.products.create({ name: 'Gold Plan' })
 *
 * Rows come back already mapped by the server, so no Stripe field name
 * (`unit_amount`, `balance_transaction`, `default_price`) appears in the React
 * app. Amounts are integer cents; format only at render, via `formatCurrency`.
 *
 * Every function throws on failure with the server's message; callers catch
 * and show `err.message`.
 */

/* --------------------------------- Products ------------------------------ */

export function listProducts() {
  return request('/products');
}

export function createProduct({ name, blurb, price, sku }) {
  return request('/products', {
    method: 'POST',
    body: { name, blurb, price, sku },
  });
}

/* ------------------------------- Transactions ---------------------------- */

export function listTransactions() {
  return request('/transactions');
}

export function refundTransaction(chargeId) {
  return request(`/transactions/${chargeId}/refund`, { method: 'POST' });
}

/* ------------------------------ Payment links ---------------------------- */

export function listPaymentLinks() {
  return request('/payment-links');
}

export function createPaymentLink({ productId, amount, quantity, customerName }) {
  return request('/payment-links', {
    method: 'POST',
    body: { productId, amount, quantity, customerName },
  });
}
