import { useCallback, useEffect, useMemo, useState } from 'react';
import { StoreContext } from './storeContext';
import { useToast } from '../hooks/useToast';
import * as stripeApi from '../api/stripeApi';

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { message: toast, showToast } = useToast();

  /** Pulls everything from Stripe. Touches state only after the request
      settles, so the mount effect below stays a pure external-system sync. */
  const load = useCallback(async () => {
    try {
      const [nextProducts, nextTransactions, nextLinks] = await Promise.all([
        stripeApi.listProducts(),
        stripeApi.listTransactions(),
        stripeApi.listPaymentLinks(),
      ]);
      setProducts(nextProducts);
      setTransactions(nextTransactions);
      setLinks(nextLinks);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /** The retry path — shows the spinner again before refetching. */
  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return load();
  }, [load]);

  /* Fetching from the Stripe API is exactly the external-system sync this rule
     exempts, and every state write happens after the request settles. */
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    load();
  }, [load]);

  const addProduct = useCallback(
    async (form) => {
      try {
        const product = await stripeApi.createProduct(form);
        setProducts((current) => [product, ...current]);
        showToast(`${product.name} added`);
      } catch (err) {
        showToast(err.message);
      }
    },
    [showToast],
  );

  const createLink = useCallback(
    async (form) => {
      try {
        const link = await stripeApi.createPaymentLink(form);
        setLinks((current) => [link, ...current]);
        showToast('Payment link created');
      } catch (err) {
        showToast(err.message);
      }
    },
    [showToast],
  );

  const refund = useCallback(
    async (transaction) => {
      try {
        const updated = await stripeApi.refundTransaction(transaction.id);
        setTransactions((current) =>
          current.map((t) => (t.id === updated.id ? updated : t)),
        );
        showToast('Refund issued');
      } catch (err) {
        showToast(err.message);
      }
    },
    [showToast],
  );

  /* Stripe has no per-product sales count, so derive it from the ledger:
     charges carry the product name as their description. */
  const decoratedProducts = useMemo(() => {
    const sold = transactions.reduce((counts, transaction) => {
      if (transaction.status !== 'Succeeded') return counts;
      counts[transaction.item] = (counts[transaction.item] || 0) + 1;
      return counts;
    }, {});

    return products.map((product) => ({
      ...product,
      initials: initials(product.name || '?'),
      sold: sold[product.name] || 0,
    }));
  }, [products, transactions]);

  const value = useMemo(
    () => ({
      products: decoratedProducts,
      transactions,
      links,
      loading,
      error,
      refresh,
      addProduct,
      createLink,
      refund,
      toast,
      showToast,
    }),
    [
      decoratedProducts,
      transactions,
      links,
      loading,
      error,
      refresh,
      addProduct,
      createLink,
      refund,
      toast,
      showToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
