import { color, font } from '../../styles/theme';

const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 20,
  padding: '14px 24px',
  background: color.white,
  borderBottom: `1px solid ${color.gray200}`,
  flex: '0 0 auto',
};

const title = {
  margin: 0,
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 19,
  letterSpacing: '-0.01em',
  color: color.gray900,
};

const subtitle = { margin: '2px 0 0', fontSize: 13, color: color.gray500 };

export function PageHeader({ title: heading, subtitle: sub, action }) {
  return (
    <header style={header}>
      <div>
        <h1 style={title}>{heading}</h1>
        <p style={subtitle}>{sub}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>{action}</div>
    </header>
  );
}
