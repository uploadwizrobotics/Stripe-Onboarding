import { color, font, shadow } from '../../styles/theme';

const toast = {
  position: 'fixed',
  bottom: 22,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 60,
  background: color.gray900,
  color: '#fff',
  borderRadius: 10,
  padding: '11px 20px',
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: 13,
  boxShadow: shadow.toast,
  animation: 'v2Rise 180ms cubic-bezier(0.34,1.56,0.64,1)',
};

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={toast} role="status" aria-live="polite">
      {message}
    </div>
  );
}
