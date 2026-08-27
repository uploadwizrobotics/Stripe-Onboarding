import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageBody } from '../../components/app-shell';
import { PageHeader } from '../../components/page-header';
import { Button } from '../../components/button';
import { EmptyState } from '../../components/empty-state';
import { TableState } from '../../components/table-state';
import { useFilters } from '../../hooks/useFilters';
import { useSelection } from '../../hooks/useSelection';
import { useStore } from '../../hooks/useStore';
import { TX_FILTERS } from '../../utils/constants';
import { TransactionTable } from './components/TransactionTable';
import { TransactionDrawer } from './components/TransactionDrawer';

const matchStatus = (transaction, filterId) => transaction.status.toLowerCase() === filterId;

export function TransactionsPage() {
  const { transactions, refund, sections } = useStore();
  const { loading, onRetry } = sections.transactions;
  const navigate = useNavigate();
  const [showFees, setShowFees] = useState(true);

  const { activeId, setActiveId, visible, clear, isFiltered } = useFilters(transactions, matchStatus);
  const selection = useSelection(transactions);

  const newLink = useCallback(() => navigate('/payment-links', { state: { open: true } }), [navigate]);

  const handleRefund = async (transaction) => {
    await refund(transaction);
    selection.clear();
  };

  const empty = (
    <TableState {...sections.transactions}>
      <EmptyState
        icon="$0"
        title={isFiltered ? 'Nothing matches that filter' : 'No payments yet'}
        body={
          isFiltered
            ? 'No charges carry that status right now. Clear the filter to see the full ledger.'
            : 'Open a payment link and pay it with test card 4242 4242 4242 4242 — it lands here within seconds.'
        }
        actions={
          <>
            {isFiltered ? (
              <Button variant="ghost" onClick={clear}>
                Show all
              </Button>
            ) : null}
            <Button onClick={newLink}>New payment link</Button>
          </>
        }
      />
    </TableState>
  );

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Every test payment, newest first."
        action={
          <>
            <Button variant="ghost" onClick={onRetry} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
            <Button onClick={newLink}>New payment link</Button>
          </>
        }
      />
      <PageBody>
        <TransactionTable
          transactions={visible}
          count={visible.length}
          filters={TX_FILTERS}
          activeFilter={activeId}
          onFilterChange={setActiveId}
          showFees={showFees}
          onToggleFees={() => setShowFees((v) => !v)}
          onSelect={selection.select}
          empty={empty}
        />
      </PageBody>

      <TransactionDrawer
        transaction={selection.selected}
        onClose={selection.clear}
        onRefund={handleRefund}
      />
    </>
  );
}
