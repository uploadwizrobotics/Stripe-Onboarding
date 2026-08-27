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

/* The three lists the app renders, each from its own endpoint.

   They load, fail and retry independently on purpose: build GET /api/products
   and the products page starts working, whether or not the other two endpoints
   exist yet. One 501 shouldn't black out the whole admin. */
const SOURCES = {
  products: stripeApi.listProducts,
  transactions: stripeApi.listTransactions,
  links: stripeApi.listPaymentLinks,
};

const EMPTY = { data: [], loading: true, error: null };

export function StoreProvider({ children }) {
  const [state, setState] = useState({
    products: EMPTY,
    transactions: EMPTY,
    links: EMPTY,
  });
  const { message: toast, showToast } = useToast();

  /** Writes one key of a slice without touching the other two. */
  const patch = useCallback((key, slice) => {
    setState((current) => ({ ...current, [key]: { ...current[key], ...slice } }));
  }, []);

  /** Fetches one list. Touches only its own slice of state, so a failure here
      can't take the other lists down with it. */
  const load = useCallback(
    async (key) => {
      patch(key, { loading: true, error: null });
      try {
        patch(key, { data: await SOURCES[key](), loading: false, error: null });
      } catch (err) {
        patch(key, { data: [], loading: false, error: err.message });
      }
    },
    [patch],
  );

  /* Deliberately not Promise.all: each list renders the moment it lands, and
     one endpoint failing leaves the others alone. */
  const refresh = useCallback(() => {
    Object.keys(SOURCES).forEach(load);
  }, [load]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    refresh();
  }, [refresh]);

  const addProduct = useCallback(
    async (form) => {
      try {
        const product = await stripeApi.createProduct(form);
        setState((current) => ({
          ...current,
          products: { ...current.products, data: [product, ...current.products.data] },
        }));
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
        setState((current) => ({
          ...current,
          links: { ...current.links, data: [link, ...current.links.data] },
        }));
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
        setState((current) => ({
          ...current,
          transactions: {
            ...current.transactions,
            data: current.transactions.data.map((t) => (t.id === updated.id ? updated : t)),
          },
        }));
        showToast('Refund issued');
      } catch (err) {
        showToast(err.message);
      }
    },
    [showToast],
  );

  /* Stripe has no per-product sales count, so derive it from the ledger:
     charges carry the product name as their description. If the transactions
     endpoint isn't built yet this is simply 0 — the products page still works. */
  const decoratedProducts = useMemo(() => {
    const sold = state.transactions.data.reduce((counts, transaction) => {
      if (transaction.status !== 'Succeeded') return counts;
      counts[transaction.item] = (counts[transaction.item] || 0) + 1;
      return counts;
    }, {});

    return state.products.data.map((product) => ({
      ...product,
      initials: initials(product.name || '?'),
      sold: sold[product.name] || 0,
    }));
  }, [state.products.data, state.transactions.data]);

  /* Per-section loading/error/retry, shaped to spread straight into
     <TableState {...sections.products} />. */
  const sections = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(SOURCES).map((key) => [
          key,
          {
            loading: state[key].loading,
            error: state[key].error,
            onRetry: () => load(key),
          },
        ]),
      ),
    [state, load],
  );

  const value = useMemo(
    () => ({
      products: decoratedProducts,
      transactions: state.transactions.data,
      links: state.links.data,
      sections,
      refresh,
      addProduct,
      createLink,
      refund,
      toast,
      showToast,
    }),
    [
      decoratedProducts,
      state.transactions.data,
      state.links.data,
      sections,
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
