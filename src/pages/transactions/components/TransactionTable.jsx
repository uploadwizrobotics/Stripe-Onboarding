import { color, font } from '../../../styles/theme';
import { DataTable } from '../../../components/data-table';
import { FilterBar } from '../../../components/filter-bar';
import { StatusChip } from '../../../components/status-chip';
import { formatCurrency, formatOptionalCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

const customer = { fontFamily: font.display, fontWeight: 600, fontSize: 14, color: color.gray900 };
const id = { fontFamily: font.mono, fontSize: 11, color: color.gray400 };
const gross = { fontFamily: font.display, fontWeight: 700, fontSize: 14, color: color.gray900 };

const feeToggle = (active) => ({
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: 12,
  color: active ? color.purple700 : color.gray500,
  padding: '6px 4px',
});

export function TransactionTable({
  transactions,
  count,
  filters,
  activeFilter,
  onFilterChange,
  showFees,
  onToggleFees,
  onSelect,
  empty,
}) {
  const columns = [
    {
      key: 'customer',
      label: 'Customer',
      flex: '1.5 1 150px',
      minWidth: 150,
      render: (t) => (
        <div>
          <div style={customer}>{t.customer}</div>
          <div style={id}>{t.id}</div>
        </div>
      ),
    },
    {
      key: 'item',
      label: 'Item',
      flex: '1.4 1 140px',
      minWidth: 140,
      render: (t) => <span style={{ fontSize: 13, color: color.gray700 }}>{t.item}</span>,
    },
    { key: 'gross', label: 'Gross', width: 84, align: 'right', render: (t) => <span style={gross}>{formatCurrency(t.gross)}</span> },
    showFees && {
      key: 'fee',
      label: 'Fee',
      width: 74,
      align: 'right',
      render: (t) => (
        <span style={{ fontSize: 13, color: color.gray400 }}>{formatOptionalCurrency(t.fee)}</span>
      ),
    },
    showFees && {
      key: 'net',
      label: 'Net',
      width: 84,
      align: 'right',
      render: (t) => (
        <span style={{ fontSize: 13, color: color.gray700 }}>{formatOptionalCurrency(t.net)}</span>
      ),
    },
    { key: 'status', label: 'Status', width: 94, render: (t) => <StatusChip status={t.status} /> },
    {
      key: 'date',
      label: 'Date',
      width: 62,
      align: 'right',
      render: (t) => <span style={{ fontSize: 12, color: color.gray500 }}>{formatDate(t.date)}</span>,
    },
  ];

  return (
    <DataTable
      title="Transactions"
      count={count}
      rows={transactions}
      columns={columns}
      minWidth={760}
      onRowClick={onSelect}
      empty={empty}
      aside={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="button" style={feeToggle(showFees)} onClick={onToggleFees}>
            {showFees ? 'Hide fees' : 'Show fees'}
          </button>
          <FilterBar filters={filters} activeId={activeFilter} onChange={onFilterChange} />
        </div>
      }
    />
  );
}
