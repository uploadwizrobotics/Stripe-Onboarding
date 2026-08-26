import { NavLink } from 'react-router-dom';
import { color, font } from '../../styles/theme';
import { TestModeBadge } from '../test-mode-badge';
import { config } from '../../utils/config';

const aside = {
  width: 216,
  flex: '0 0 216px',
  background: color.white,
  borderRight: `1px solid ${color.gray200}`,
  display: 'flex',
  flexDirection: 'column',
  padding: '18px 12px',
};

const brand = { display: 'flex', alignItems: 'center', gap: 9, padding: '4px 10px 20px' };

const mark = {
  width: 24,
  height: 24,
  borderRadius: 7,
  background: color.purple600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: font.display,
  fontWeight: 800,
  fontSize: 12,
  color: '#fff',
};

const brandName = {
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: '-0.01em',
  color: color.gray900,
};

const nav = { display: 'flex', flexDirection: 'column', gap: 2 };

const navItem = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  textAlign: 'left',
  padding: '9px 12px',
  borderRadius: 9,
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: 14,
  background: isActive ? color.purple50 : 'transparent',
  color: isActive ? color.purple700 : color.gray700,
  transition: 'background 150ms ease',
});

const count = { fontSize: 12, fontWeight: 600, color: color.gray400 };

const footer = { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 };

const user = {
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  padding: '8px 10px',
  borderRadius: 11,
  background: color.gray50,
};

const avatar = {
  width: 28,
  height: 28,
  borderRadius: 999,
  background: color.purple600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 12,
  color: '#fff',
};

export function Sidebar({ storeName, items, owner }) {
  return (
    <aside style={aside}>
      <div style={brand}>
        <div style={mark}>{storeName.charAt(0)}</div>
        <span style={brandName}>{storeName}</span>
      </div>

      <nav style={nav}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? undefined : 'hv-nav')}
            style={({ isActive }) => navItem(isActive)}
          >
            <span>{item.label}</span>
            <span style={count}>{item.count}</span>
          </NavLink>
        ))}
      </nav>

      <div style={footer}>
        {config.isTestMode ? <TestModeBadge /> : null}
        <div style={user}>
          <div style={avatar}>{owner.name.charAt(0)}</div>
          <div style={{ lineHeight: 1.25, minWidth: 0 }}>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 13, color: color.gray900 }}>
              {owner.name}
            </div>
            <div style={{ fontSize: 11, color: color.gray500 }}>{owner.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
