import { useContext } from 'react';
import { StoreContext } from '../store/storeContext';

/** Products, transactions, and payment links, plus the actions over them. */
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
