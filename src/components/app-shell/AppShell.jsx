import { color, font } from '../../styles/theme';

const shell = {
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  background: color.white,
  fontFamily: font.body,
  color: color.gray700,
};

const main = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  background: color.gray50,
};

/**
 * Sidebar + main column. Pages supply their own PageHeader and PageBody so the
 * header stays pinned while only the body scrolls.
 */
export function AppShell({ sidebar, children, overlays }) {
  return (
    <div style={shell}>
      {sidebar}
      <main style={main}>{children}</main>
      {overlays}
    </div>
  );
}

const body = {
  flex: 1,
  minHeight: 0,
  padding: '16px 24px 24px',
  overflow: 'auto',
};

export function PageBody({ children }) {
  return <div style={body}>{children}</div>;
}
