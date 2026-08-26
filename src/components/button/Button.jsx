import { color, font } from '../../styles/theme';

const base = {
  fontFamily: font.display,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background 150ms ease',
};

const sizes = {
  sm: { borderRadius: 8, padding: '6px 11px', fontSize: 12 },
  md: { borderRadius: 9, padding: '9px 16px', fontSize: 13 },
  lg: { borderRadius: 9, padding: '10px 18px', fontSize: 13 },
};

const variants = {
  primary: {
    style: { border: 0, background: color.purple600, color: '#fff' },
    className: 'hv-primary',
  },
  ghost: {
    style: { border: `1px solid ${color.gray300}`, background: color.white, color: color.gray700 },
    className: 'hv-ghost',
  },
  link: {
    style: { border: `1px solid ${color.gray300}`, background: color.white, color: color.purple700 },
    className: 'hv-link',
  },
  danger: {
    style: { border: `1px solid ${color.orange400}`, background: color.white, color: color.orange600 },
    className: 'hv-danger',
  },
};

/**
 * `as="a"` renders a link that looks like a button — used for Stripe's hosted
 * checkout pages. A disabled link isn't a thing, so it falls back to a
 * disabled button.
 */
export function Button({ as, variant = 'primary', size = 'md', style, disabled, ...props }) {
  const tone = variants[variant];
  const styles = {
    ...base,
    ...sizes[size],
    ...tone.style,
    ...(disabled ? { opacity: 0.5 } : null),
    ...style,
  };

  if (as === 'a' && !disabled) {
    return (
      <a
        className={tone.className}
        style={{ ...styles, display: 'inline-block', textDecoration: 'none' }}
        {...props}
      />
    );
  }

  const { href: _href, target: _target, rel: _rel, ...buttonProps } = props;
  return (
    <button
      type="button"
      className={disabled ? undefined : tone.className}
      disabled={disabled}
      style={styles}
      {...buttonProps}
    />
  );
}
