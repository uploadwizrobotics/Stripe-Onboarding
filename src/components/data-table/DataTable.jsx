import { color, font, shadow } from '../../styles/theme';

const card = {
  background: color.white,
  border: `1px solid ${color.gray200}`,
  borderRadius: 13,
  boxShadow: shadow.card,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
};

const cardHead = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 14,
  padding: '14px 18px',
  borderBottom: `1px solid ${color.gray200}`,
  flexWrap: 'wrap',
};

const heading = {
  margin: 0,
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 15,
  color: color.gray900,
};

const countPill = {
  fontSize: 12,
  fontWeight: 600,
  color: color.gray500,
  background: color.gray100,
  borderRadius: 999,
  padding: '2px 9px',
};

const headRow = (minWidth) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '9px 18px',
  minWidth,
  background: color.gray50,
  borderBottom: `1px solid ${color.gray200}`,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: color.gray500,
});

const bodyRow = (minWidth, clickable) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '11px 18px',
  minWidth,
  borderBottom: `1px solid ${color.gray100}`,
  cursor: clickable ? 'pointer' : 'default',
  transition: 'background 120ms ease',
});

/** Column widths come from the spec so header and body always line up. */
const cellStyle = (column) => ({
  ...(column.flex
    ? { flex: column.flex, minWidth: column.minWidth ?? 0 }
    : { flex: '0 0 auto', width: column.width }),
  ...(column.align === 'right' ? { textAlign: 'right' } : null),
});

/**
 * Flex-based table shared by products, transactions, and links.
 * `columns` entries: { key, label, flex | width, minWidth, align, render }.
 * A falsy entry is skipped, which is how the fee columns toggle.
 */
export function DataTable({
  title,
  count,
  aside,
  columns,
  rows,
  rowKey = (row) => row.id,
  onRowClick,
  minWidth = 620,
  empty,
}) {
  const visibleColumns = columns.filter(Boolean);

  return (
    <section style={card}>
      <div style={cardHead}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <h2 style={heading}>{title}</h2>
          <span style={countPill}>{count ?? rows.length}</span>
        </div>
        {aside}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={headRow(minWidth)}>
          {visibleColumns.map((column) => (
            <div key={column.key} style={cellStyle(column)}>
              {column.label}
            </div>
          ))}
        </div>

        {rows.map((row) => (
          <div
            key={rowKey(row)}
            className="hv-row"
            style={bodyRow(minWidth, Boolean(onRowClick))}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {visibleColumns.map((column) => (
              <div key={column.key} style={cellStyle(column)}>
                {column.render(row)}
              </div>
            ))}
          </div>
        ))}

        {rows.length === 0 ? empty : null}
      </div>
    </section>
  );
}
