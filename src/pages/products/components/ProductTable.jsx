import { color, font } from '../../../styles/theme';
import { Button } from '../../../components/button';
import { DataTable } from '../../../components/data-table';
import { StatusChip } from '../../../components/status-chip';
import { formatCurrency } from '../../../utils/formatCurrency';

const avatar = {
  flex: '0 0 auto',
  width: 30,
  height: 30,
  borderRadius: 8,
  background: color.gray100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 11,
  color: color.gray700,
};

const name = { fontFamily: font.display, fontWeight: 600, fontSize: 14, color: color.gray900 };

const blurb = {
  fontSize: 12,
  color: color.gray500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const price = {
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 14,
  color: color.gray900,
};

export function ProductTable({ products, onCreateLink, empty }) {
  const columns = [
    {
      key: 'product',
      label: 'Product',
      flex: '2 1 200px',
      minWidth: 200,
      render: (p) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={avatar}>{p.initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={name}>{p.name}</div>
            <div style={blurb}>{p.blurb}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'sku',
      label: 'SKU',
      width: 120,
      render: (p) => (
        <span style={{ fontFamily: font.mono, fontSize: 11, color: color.gray500 }}>{p.sku}</span>
      ),
    },
    { key: 'price', label: 'Price', width: 84, align: 'right', render: (p) => <span style={price}>{formatCurrency(p.price)}</span> },
    { key: 'sold', label: 'Sold', width: 60, align: 'right', render: (p) => <span style={{ fontSize: 13, color: color.gray700 }}>{p.sold}</span> },
    { key: 'status', label: 'Status', width: 76, render: (p) => <StatusChip status={p.status} /> },
    {
      key: 'actions',
      label: '',
      width: 92,
      render: (p) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="link" size="sm" onClick={() => onCreateLink(p)}>
            Link
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Products"
      rows={products}
      columns={columns}
      minWidth={620}
      empty={empty}
      aside={
        <div style={{ fontSize: 12, color: color.gray500 }}>Create a product, then a link</div>
      }
    />
  );
}
