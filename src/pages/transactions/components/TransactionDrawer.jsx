import { color, font } from '../../../styles/theme';
import { Button } from '../../../components/button';
import { Drawer } from '../../../components/drawer';
import { StatusChip } from '../../../components/status-chip';
import { formatCurrency, formatOptionalCurrency } from '../../../utils/formatCurrency';
import { formatDateTime } from '../../../utils/formatDate';

const amount = {
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 26,
  letterSpacing: '-0.01em',
  color: color.gray900,
};

const rowsBox = { border: `1px solid ${color.gray200}`, borderRadius: 11, overflow: 'hidden' };

const detailRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 14,
  padding: '11px 14px',
  borderBottom: `1px solid ${color.gray100}`,
};

const key = { fontSize: 13, color: color.gray500 };
const val = {
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: 13,
  color: color.gray900,
  textAlign: 'right',
};

const timelineBox = {
  border: `1px solid ${color.gray200}`,
  borderRadius: 11,
  padding: 14,
  background: color.gray50,
};

const dot = {
  flex: '0 0 7px',
  width: 7,
  height: 7,
  borderRadius: 999,
  background: color.gray400,
  marginTop: 5,
};

/** Timeline is derived — the ledger only stores the payment itself. */
function buildTimeline(transaction) {
  const events = [
    { label: 'Payment link opened', when: transaction.date },
    { label: `Card charged · ${transaction.card}`, when: transaction.date },
  ];
  if (transaction.status === 'Succeeded') events.push({ label: 'Payment succeeded', when: transaction.date });
  if (transaction.status === 'Refunded') events.push({ label: 'Refunded in full', when: transaction.date });
  if (transaction.status === 'Failed') events.push({ label: 'Card declined', when: transaction.date });
  return events;
}

export function TransactionDrawer({ transaction, onClose, onRefund }) {
  const isOpen = Boolean(transaction);
  if (!isOpen) return <Drawer isOpen={false} onClose={onClose} />;

  const rows = [
    { k: 'Customer', v: transaction.customer },
    { k: 'Email', v: transaction.email },
    { k: 'Item', v: transaction.item },
    { k: 'Card', v: transaction.card },
    { k: 'Fee', v: formatOptionalCurrency(transaction.fee) },
    { k: 'Net', v: formatOptionalCurrency(transaction.net) },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} label={`Transaction ${transaction.id}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={amount}>{formatCurrency(transaction.gross)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <StatusChip status={transaction.status} />
            <span style={{ fontFamily: font.mono, fontSize: 11, color: color.gray400 }}>
              {transaction.id}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ background: 'transparent', border: 0, fontSize: 20, lineHeight: 1, color: color.gray400, cursor: 'pointer' }}
        >
          ×
        </button>
      </div>

      <div style={rowsBox}>
        {rows.map((row) => (
          <div key={row.k} style={detailRow}>
            <span style={key}>{row.k}</span>
            <span style={val}>{row.v}</span>
          </div>
        ))}
      </div>

      <div style={timelineBox}>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 13, color: color.gray900, marginBottom: 10 }}>
          Timeline
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {buildTimeline(transaction).map((event, index) => (
            <div key={`${event.label}-${index}`} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <div style={dot} />
              <div>
                <div style={{ fontSize: 13, color: color.gray700 }}>{event.label}</div>
                <div style={{ fontSize: 11, color: color.gray500 }}>{formatDateTime(event.when)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {transaction.status === 'Succeeded' ? (
        <Button variant="danger" size="lg" onClick={() => onRefund(transaction)}>
          Refund {formatCurrency(transaction.gross)}
        </Button>
      ) : null}
    </Drawer>
  );
}
