import { useNavigate } from 'react-router-dom';
import { PageBody } from '../../components/app-shell';
import { PageHeader } from '../../components/page-header';
import { Button } from '../../components/button';
import { EmptyState } from '../../components/empty-state';
import { TableState } from '../../components/table-state';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useStore } from '../../hooks/useStore';
import { ProductTable } from './components/ProductTable';
import { AddProductModal } from './components/AddProductModal';

export function ProductsPage() {
  const { products, addProduct, loading, error, refresh } = useStore();
  const modal = useDisclosure();
  const navigate = useNavigate();

  /** "Link" on a row hands the product to the payment-links page, prefilled. */
  const createLinkFor = (product) =>
    navigate('/payment-links', { state: { productId: product.id } });

  const empty = (
    <TableState loading={loading} error={error} onRetry={refresh}>
      <EmptyState
        title="No products yet"
        body="Add your first one — it's created straight in your Stripe sandbox, then you can turn it into a payment link."
        actions={<Button onClick={modal.open}>Add product</Button>}
      />
    </TableState>
  );

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Everything you sell, in one place."
        action={<Button onClick={modal.open}>Add product</Button>}
      />
      <PageBody>
        <ProductTable products={products} onCreateLink={createLinkFor} empty={empty} />
      </PageBody>

      <AddProductModal isOpen={modal.isOpen} onClose={modal.close} onSave={addProduct} />
    </>
  );
}
