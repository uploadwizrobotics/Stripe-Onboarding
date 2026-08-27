import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/app-shell';
import { Sidebar } from './components/sidebar';
import { Toast } from './components/toast';
import { useStore } from './hooks/useStore';
import { OWNER, STORE_NAME } from './utils/constants';
import { ProductsPage } from './pages/products/ProductsPage';
import { TransactionsPage } from './pages/transactions/TransactionsPage';
import { PaymentLinksPage } from './pages/payment-links/PaymentLinksPage';

function Layout() {
  const { products, transactions, links, sections, toast } = useStore();

  /* Each count waits on its own section, so a list that's loaded shows its
     number even while the others are still fetching or erroring. Blank rather
     than 0 until then. */
  const countOf = (list, section) => (section.loading || section.error ? '' : list.length);

  const navItems = [
    { to: '/products', label: 'Products', count: countOf(products, sections.products) },
    {
      to: '/transactions',
      label: 'Transactions',
      count: countOf(transactions, sections.transactions),
    },
    { to: '/payment-links', label: 'Payment links', count: countOf(links, sections.links) },
  ];

  return (
    <AppShell
      sidebar={
        <Sidebar storeName={STORE_NAME} items={navItems} owner={OWNER} />
      }
      overlays={<Toast message={toast} />}
    >
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/payment-links" element={<PaymentLinksPage />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Route>
    </Routes>
  );
}
