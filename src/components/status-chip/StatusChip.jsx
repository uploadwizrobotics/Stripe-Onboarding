import { chipFor, font } from '../../styles/theme';

/** Pill used by every table and the transaction drawer. */
export function StatusChip({ status }) {
  const { bg, fg } = chipFor(status);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 9px',
        borderRadius: 999,
        fontFamily: font.display,
        fontWeight: 600,
        fontSize: 11,
        background: bg,
        color: fg,
      }}
    >
      {status}
    </span>
  );
}
