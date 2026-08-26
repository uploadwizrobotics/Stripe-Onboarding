import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageBody } from '../../components/app-shell';
import { PageHeader } from '../../components/page-header';
import { Button } from '../../components/button';
import { EmptyState } from '../../components/empty-state';
import { TableState } from '../../components/table-state';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useStore } from '../../hooks/useStore';
import { PaymentLinkTable } from './components/PaymentLinkTable';
import { NewLinkModal } from './components/NewLinkModal';

export function PaymentLinksPage() {
  const { links, products, createLink, showToast, loading, error, refresh } = useStore();
  const location = useLocation();

  /* Arriving from a product's "Link" button (or the ledger's empty state)
     opens the modal prefilled — read once, at mount. */
  const [arrival] = useState(() => location.state ?? null);
  const modal = useDisclosure(Boolean(arrival?.open || arrival?.productId));
  const [seedProductId, setSeedProductId] = useState(arrival?.productId ?? null);
  const [openKey, setOpenKey] = useState(0);

  /* Bumping the key remounts the modal, so every open starts clean. */
  const openBlank = () => {
    setSeedProductId(null);
    setOpenKey((k) => k + 1);
    modal.open();
  };

  const empty = (
    <TableState loading={loading} error={error} onRetry={refresh}>
      <EmptyState
        title="No links yet"
        body="Create one and share it — once someone pays, the charge shows up in the transactions ledger."
        actions={
          <Button onClick={openBlank} disabled={products.length === 0}>
            New payment link
          </Button>
        }
      />
    </TableState>
  );

  return (
    <>
      <PageHeader
        title="Payment links"
        subtitle="Share a link, take a test payment."
        action={
          <Button onClick={openBlank} disabled={loading || products.length === 0}>
            New payment link
          </Button>
        }
      />
      <PageBody>
        <PaymentLinkTable
          links={links}
          onCopy={() => showToast('Link copied')}
          empty={empty}
        />
      </PageBody>

      {modal.isOpen ? (
        <NewLinkModal
          key={`${seedProductId ?? 'blank'}-${openKey}`}
          onClose={modal.close}
          products={products}
          initialProductId={seedProductId}
          onCreate={createLink}
        />
      ) : null}
    </>
  );
}
