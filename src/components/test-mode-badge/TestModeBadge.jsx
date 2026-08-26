import { color, font } from '../../styles/theme';

const box = {
  border: `1px solid ${color.orange300}`,
  background: color.orange200,
  borderRadius: 11,
  padding: '11px 12px',
};

const label = {
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.09em',
  color: color.orange600,
};

const note = { fontSize: 12, lineHeight: 1.45, color: color.gray700, marginTop: 3 };

/** Sandbox marker — the design keeps this pinned above the account block. */
export function TestModeBadge() {
  return (
    <div style={box}>
      <div style={label}>TEST MODE</div>
      <div style={note}>Payments are simulated.</div>
    </div>
  );
}
