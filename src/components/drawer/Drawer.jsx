import { color, scrim, shadow } from '../../styles/theme';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const overlay = {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  display: 'flex',
  justifyContent: 'flex-end',
};

const panel = {
  width: 400,
  maxWidth: '100%',
  background: color.white,
  boxShadow: shadow.drawer,
  padding: 22,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  animation: 'v2Slide 200ms cubic-bezier(0.4,0,0.2,1)',
};

/** Right-hand detail panel. */
export function Drawer({ isOpen, onClose, children, label }) {
  useEscapeKey(onClose, isOpen);
  if (!isOpen) return null;

  return (
    <div style={overlay}>
      <div style={{ flex: 1, background: scrim.drawer }} onClick={onClose} role="presentation" />
      <div style={panel} role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </div>
    </div>
  );
}
