import { color, font, shadow } from '../../styles/theme';

const bar = {
  display: 'flex',
  gap: 4,
  background: color.gray100,
  borderRadius: 9,
  padding: 3,
};

const chip = (isActive) => ({
  border: 0,
  cursor: 'pointer',
  borderRadius: 7,
  padding: '6px 12px',
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: 12,
  background: isActive ? color.white : 'transparent',
  color: isActive ? color.gray900 : color.gray500,
  boxShadow: isActive ? shadow.chip : 'none',
  transition: 'background 150ms ease',
});

/** Segmented control above the transactions ledger. */
export function FilterBar({ filters, activeId, onChange }) {
  return (
    <div style={bar}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          style={chip(filter.id === activeId)}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
