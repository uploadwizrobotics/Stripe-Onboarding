import { color, font } from '../../styles/theme';

const label = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: 13,
  color: color.gray700,
};

const control = {
  border: `1px solid ${color.gray300}`,
  borderRadius: 9,
  padding: '10px 12px',
  fontSize: 14,
  color: color.gray700,
  background: color.white,
  width: '100%',
};

export function Field({ label: text, children, style }) {
  return (
    <label style={{ ...label, ...style }}>
      <span>{text}</span>
      {children}
    </label>
  );
}

export function TextInput({ style, ...props }) {
  return <input style={{ ...control, ...style }} {...props} />;
}

export function Select({ style, children, ...props }) {
  return (
    <select style={{ ...control, ...style }} {...props}>
      {children}
    </select>
  );
}
