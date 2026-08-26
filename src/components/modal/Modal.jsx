import { color, font, scrim, shadow } from '../../styles/theme';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const overlay = (zIndex) => ({
  position: 'fixed',
  inset: 0,
  background: scrim.modal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  zIndex,
});

const card = {
  width: 470,
  maxWidth: '100%',
  background: color.white,
  borderRadius: 14,
  boxShadow: shadow.modal,
  padding: 22,
  animation: 'v2Rise 180ms cubic-bezier(0.34,1.56,0.64,1)',
};

const title = {
  margin: 0,
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 18,
  color: color.gray900,
};

const closeButton = {
  background: 'transparent',
  border: 0,
  fontSize: 20,
  lineHeight: 1,
  color: color.gray400,
  cursor: 'pointer',
};

export function Modal({ isOpen, onClose, title: heading, subtitle, children, footer, zIndex = 40 }) {
  useEscapeKey(onClose, isOpen);
  if (!isOpen) return null;

  return (
    <div style={overlay(zIndex)} onClick={onClose} role="presentation">
      <div
        style={card}
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
          <div>
            <h2 style={title}>{heading}</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: color.gray500 }}>{subtitle}</p>
          </div>
          <button type="button" style={closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 18 }}>
          {children}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9, marginTop: 20 }}>
          {footer}
        </div>
      </div>
    </div>
  );
}
