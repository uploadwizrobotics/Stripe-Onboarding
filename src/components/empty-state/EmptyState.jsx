import { color, font } from '../../styles/theme';

const wrap = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '44px 24px 48px',
};

const glyph = {
  width: 40,
  height: 40,
  borderRadius: 11,
  border: `1px solid ${color.gray200}`,
  background: color.gray50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: font.mono,
  fontSize: 11,
  color: color.gray400,
};

const title = {
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 16,
  color: color.gray900,
  marginTop: 14,
};

const body = {
  margin: '6px 0 0',
  maxWidth: 340,
  fontSize: 13,
  lineHeight: 1.5,
  color: color.gray500,
};

export function EmptyState({ icon, title: heading, body: text, actions }) {
  return (
    <div style={wrap}>
      {icon ? <div style={glyph}>{icon}</div> : null}
      <div style={{ ...title, marginTop: icon ? 14 : 0 }}>{heading}</div>
      <p style={body}>{text}</p>
      {actions ? <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>{actions}</div> : null}
    </div>
  );
}
