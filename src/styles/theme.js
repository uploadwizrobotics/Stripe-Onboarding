/* WIZ Robotics tokens, surfaced as JS so inline styles stay readable.
   Values are `var(--token)` references — the CSS in styles/tokens/ is the
   single source of truth. */

export const color = {
  purple50: 'var(--purple-50)',
  purple300: 'var(--purple-300)',
  purple600: 'var(--purple-600)',
  purple700: 'var(--purple-700)',
  orange200: 'var(--orange-200)',
  orange300: 'var(--orange-300)',
  orange400: 'var(--orange-400)',
  orange600: 'var(--orange-600)',
  gray50: 'var(--gray-50)',
  gray100: 'var(--gray-100)',
  gray200: 'var(--gray-200)',
  gray300: 'var(--gray-300)',
  gray400: 'var(--gray-400)',
  gray500: 'var(--gray-500)',
  gray700: 'var(--gray-700)',
  gray900: 'var(--gray-900)',
  white: 'var(--white)',
};

export const font = {
  display: 'var(--font-display)',
  body: 'var(--font-body)',
  mono: 'var(--font-mono)',
};

export const shadow = {
  card: '0 1px 2px rgba(16,24,40,0.04)',
  modal: '0 20px 44px rgba(16,24,40,0.22)',
  drawer: '-12px 0 32px rgba(16,24,40,0.16)',
  toast: '0 12px 28px rgba(16,24,40,0.28)',
  chip: '0 1px 2px rgba(16,24,40,0.10)',
};

export const scrim = {
  modal: 'rgba(16,24,40,0.42)',
  drawer: 'rgba(16,24,40,0.32)',
};

/* The design system has no success/danger hues — these extend it for
   status chips, tuned to sit alongside the neutral scale. */
export const chip = {
  success: { bg: '#ECFDF3', fg: '#027A48' },
  pending: { bg: 'var(--orange-200)', fg: 'var(--orange-600)' },
  neutral: { bg: 'var(--gray-100)', fg: 'var(--gray-700)' },
  failed: { bg: '#FEF3F2', fg: '#B42318' },
};

export const STATUS_CHIP = {
  /* Products and payment links: Stripe's `active` flag. */
  Active: chip.success,
  Draft: chip.neutral,
  Inactive: chip.neutral,
  /* Charges. */
  Succeeded: chip.success,
  Refunded: chip.neutral,
  Pending: chip.pending,
  Failed: chip.failed,
};

export const chipFor = (status) => STATUS_CHIP[status] || chip.neutral;
