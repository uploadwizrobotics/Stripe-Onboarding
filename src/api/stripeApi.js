import { request } from './client';

/* The browser side of the API in stripe-api.js. Each function throws on
   failure — callers catch. */

export const listProducts = () => request('/products');

export const createProduct = ({ name, blurb, price, sku }) =>
  request('/products', { method: 'POST', body: { name, blurb, price, sku } });

export const listTransactions = () => request('/transactions');

export const refundTransaction = (chargeId) =>
  request(`/transactions/${chargeId}/refund`, { method: 'POST' });

export const listPaymentLinks = () => request('/payment-links');

export const createPaymentLink = ({ productId, amount, quantity, customerName }) =>
  request('/payment-links', {
    method: 'POST',
    body: { productId, amount, quantity, customerName },
  });
