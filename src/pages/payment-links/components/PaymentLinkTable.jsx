import { color, font } from '../../../styles/theme';
import { Button } from '../../../components/button';
import { CopyButton } from '../../../components/copy-button';
import { DataTable } from '../../../components/data-table';
import { StatusChip } from '../../../components/status-chip';
import { formatCurrency } from '../../../utils/formatCurrency';

const item = { fontFamily: font.display, fontWeight: 600, fontSize: 14, color: color.gray900 };

const url = {
  fontFamily: font.mono,
  fontSize: 11,
  color: color.gray500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
};

const amount = { fontFamily: font.display, fontWeight: 700, fontSize: 14, color: color.gray900 };

const customer = {
  fontSize: 13,
  color: color.gray700,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
};

export function PaymentLinkTable({ links, onCopy, empty }) {
  const columns = [
    { key: 'item', label: 'Item', flex: '1.4 1 160px', minWidth: 160, render: (l) => <span style={item}>{l.item}</span> },
    { key: 'url', label: 'Link', flex: '1.6 1 190px', minWidth: 190, render: (l) => <span style={url}>{l.url}</span> },
    { key: 'amount', label: 'Amount', width: 90, align: 'right', render: (l) => <span style={amount}>{formatCurrency(l.amount)}</span> },
    { key: 'customer', label: 'Customer', width: 120, render: (l) => <span style={customer}>{l.customer}</span> },
    { key: 'status', label: 'Status', width: 78, render: (l) => <StatusChip status={l.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      width: 170,
      /* Paying is the customer's job on Stripe's hosted page — the most this
         side can do is open it. Test card: 4242 4242 4242 4242. */
      render: (l) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <CopyButton value={l.url} onCopied={onCopy} />
          <Button
            as="a"
            size="sm"
            href={l.url}
            target="_blank"
            rel="noreferrer"
            disabled={l.status !== 'Active'}
          >
            Open
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Payment links"
      rows={links}
      columns={columns}
      minWidth={780}
      empty={empty}
      aside={
        <div style={{ fontSize: 12, color: color.gray500 }}>Paid links appear in transactions</div>
      }
    />
  );
}
