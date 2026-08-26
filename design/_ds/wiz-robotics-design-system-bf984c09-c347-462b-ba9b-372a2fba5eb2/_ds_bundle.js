/* @ds-bundle: {"format":4,"namespace":"WIZRoboticsDesignSystem_bf984c","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"BinaryBlock","sourcePath":"components/decor/BinaryBlock.jsx"},{"name":"Sparkle","sourcePath":"components/decor/Sparkle.jsx"},{"name":"SquareCluster","sourcePath":"components/decor/SquareCluster.jsx"},{"name":"NavBar","sourcePath":"components/site/NavBar.jsx"},{"name":"PhotoFrame","sourcePath":"components/site/PhotoFrame.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"cb3336faaf0e","components/core/Button.jsx":"9467a685578d","components/core/Card.jsx":"c2502c4f0561","components/decor/BinaryBlock.jsx":"f81925983815","components/decor/Sparkle.jsx":"ceee5ede8cd1","components/decor/SquareCluster.jsx":"b56a2302685e","components/site/NavBar.jsx":"7bf288f18f5a","components/site/PhotoFrame.jsx":"408519d2c162","ui_kits/website/sections.jsx":"93baeb68c0cc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WIZRoboticsDesignSystem_bf984c = window.WIZRoboticsDesignSystem_bf984c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge / eyebrow pill — small rounded label for tags, categories, "eyebrows".
 */
function Badge({
  children,
  color = 'purple',
  // 'purple' | 'orange' | 'neutral'
  soft = true,
  // soft (tinted bg) vs solid
  style = {},
  ...rest
}) {
  const palettes = {
    purple: soft ? {
      background: 'var(--purple-100)',
      color: 'var(--purple-700)'
    } : {
      background: 'var(--brand-primary)',
      color: 'var(--white)'
    },
    orange: soft ? {
      background: 'var(--orange-200)',
      color: 'var(--orange-600)'
    } : {
      background: 'var(--brand-accent)',
      color: 'var(--white)'
    },
    neutral: soft ? {
      background: 'var(--gray-100)',
      color: 'var(--gray-700)'
    } : {
      background: 'var(--gray-900)',
      color: 'var(--white)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '0.01em',
      lineHeight: 1,
      ...palettes[color],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * WIZ Robotics Button.
 * Rounded, friendly, brand-purple by default with an orange accent option.
 */
function Button({
  children,
  variant = 'primary',
  // 'primary' | 'accent' | 'secondary' | 'ghost'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  iconLeft = null,
  iconRight = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: 14
    },
    md: {
      padding: '12px 22px',
      fontSize: 15
    },
    lg: {
      padding: '15px 28px',
      fontSize: 17
    }
  };
  const variants = {
    primary: {
      background: 'var(--brand-primary)',
      color: 'var(--text-on-brand)',
      border: '2px solid transparent',
      boxShadow: 'var(--shadow-brand)'
    },
    accent: {
      background: 'var(--brand-accent)',
      color: 'var(--white)',
      border: '2px solid transparent',
      boxShadow: 'var(--shadow-accent)'
    },
    secondary: {
      background: 'var(--white)',
      color: 'var(--brand-primary)',
      border: '2px solid var(--border-default)',
      boxShadow: 'var(--shadow-xs)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--brand-primary)',
      border: '2px solid transparent',
      boxShadow: 'none'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      lineHeight: 1,
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'transform var(--dur-fast) var(--ease-bounce), filter var(--dur-base) var(--ease-standard)',
      ...sizes[size],
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.96)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Program / content card — image on top, body below.
 * Soft rounded corners, subtle purple-tinted shadow, lifts on hover.
 */
function Card({
  image = null,
  imageAlt = '',
  badge = null,
  title,
  children,
  footer = null,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'transform var(--dur-base) var(--ease-bounce), box-shadow var(--dur-base) var(--ease-standard)',
      ...style
    }
  }, rest), image && /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '16 / 10',
      overflow: 'hidden',
      background: 'var(--purple-50)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      flex: 1
    }
  }, badge, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-body)',
      lineHeight: 1.55
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 8
    }
  }, footer)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/decor/BinaryBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BinaryBlock — a small grid of 0s and 1s ("binary rain"), the signature
 * WIZ Robotics hero motif. Purely decorative.
 */
function BinaryBlock({
  rows = 4,
  cols = 10,
  color = 'var(--motif-purple)',
  fontSize = 13,
  style = {},
  ...rest
}) {
  const lines = React.useMemo(() => {
    const out = [];
    for (let r = 0; r < rows; r++) {
      let s = '';
      for (let c = 0; c < cols; c++) s += Math.round(Math.random());
      out.push(s);
    }
    return out;
  }, [rows, cols]);
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize,
      lineHeight: 1.35,
      letterSpacing: '0.12em',
      color,
      userSelect: 'none',
      ...style
    }
  }, rest), lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, l)));
}
Object.assign(__ds_scope, { BinaryBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/decor/BinaryBlock.jsx", error: String((e && e.message) || e) }); }

// components/decor/Sparkle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Sparkle — a 4-point star used to scatter playful energy across hero sections.
 * Pure decorative motif. Purple or orange.
 */
function Sparkle({
  size = 20,
  color = 'var(--motif-purple)',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      display: 'block',
      ...style
    },
    "aria-hidden": "true"
  }, rest), /*#__PURE__*/React.createElement("path", {
    d: "M12 0 C12.6 6.2 17.8 11.4 24 12 C17.8 12.6 12.6 17.8 12 24 C11.4 17.8 6.2 12.6 0 12 C6.2 11.4 11.4 6.2 12 0 Z",
    fill: color
  }));
}
Object.assign(__ds_scope, { Sparkle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/decor/Sparkle.jsx", error: String((e && e.message) || e) }); }

// components/decor/SquareCluster.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SquareCluster — 2–4 small rounded squares in brand colors, arranged in a
 * loose cluster. Recreates the pixel/block motif from the hero.
 */
function SquareCluster({
  size = 18,
  gap = 4,
  style = {},
  ...rest
}) {
  const sq = bg => ({
    width: size,
    height: size,
    borderRadius: 4,
    background: bg
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(2, ${size}px)`,
      gap,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: sq('var(--purple-500)')
  }), /*#__PURE__*/React.createElement("div", {
    style: sq('var(--orange-500)')
  }), /*#__PURE__*/React.createElement("div", {
    style: sq('var(--orange-400)')
  }), /*#__PURE__*/React.createElement("div", {
    style: sq('var(--purple-400)')
  }));
}
Object.assign(__ds_scope, { SquareCluster });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/decor/SquareCluster.jsx", error: String((e && e.message) || e) }); }

// components/site/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Site header — dark purple utility bar on top, white main nav below.
 * Recreation of the WIZ Robotics website header.
 */
function NavBar({
  brand = 'WIZ',
  links = ['Programs', 'Camps', 'Events & News', 'About Us'],
  utility = 'Student Portal',
  lang = 'EN/中文',
  cta = 'Book A Free Trial',
  onCta,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--white)',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 16,
      padding: '8px 32px',
      fontSize: 13,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--white)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, utility, " ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2197")), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--white)',
      color: 'var(--purple-900)',
      borderRadius: 6,
      padding: '2px 8px',
      fontSize: 12,
      fontWeight: 700
    }
  }, lang)), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 32px',
      background: 'var(--white)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 24,
      color: 'var(--purple-700)',
      letterSpacing: '-0.01em'
    }
  }, brand), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 10,
      color: 'var(--gray-500)',
      letterSpacing: 'var(--ls-wide)'
    }
  }, "ROBOTICS")), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      gap: 32,
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--gray-700)',
      fontWeight: 600,
      fontSize: 15
    }
  }, l)))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    onClick: onCta
  }, cta)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/site/PhotoFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PhotoFrame — a photo with a large rounded corner and a slight playful tilt,
 * as seen in the WIZ Robotics hero collage.
 */
function PhotoFrame({
  src,
  alt = '',
  tilt = -4,
  // degrees
  width = 240,
  ratio = '4 / 5',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      aspectRatio: ratio,
      borderRadius: '18px 18px 18px 40px',
      overflow: 'hidden',
      transform: `rotate(${tilt}deg)`,
      boxShadow: 'var(--shadow-md)',
      background: 'var(--purple-50)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }));
}
Object.assign(__ds_scope, { PhotoFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/PhotoFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/sections.jsx
try { (() => {
/* WIZ Robotics website — homepage sections.
   Composes DS primitives from the compiled bundle. Exports to window. */
const {
  Button,
  Badge,
  Card,
  NavBar,
  PhotoFrame,
  Sparkle,
  BinaryBlock,
  SquareCluster
} = window.WIZRoboticsDesignSystem_bf984c;
const A = 'assets';
function Hero({
  onTrial
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--white)',
      overflow: 'hidden',
      padding: '64px 24px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '10%',
      top: 90
    }
  }, /*#__PURE__*/React.createElement(SquareCluster, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '12%',
      top: 200
    }
  }, /*#__PURE__*/React.createElement(BinaryBlock, {
    rows: 4,
    cols: 9,
    color: "var(--purple-400)",
    fontSize: 12
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '18%',
      top: 60
    }
  }, /*#__PURE__*/React.createElement(Sparkle, {
    size: 20,
    color: "var(--purple-500)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '15%',
      top: 300
    }
  }, /*#__PURE__*/React.createElement(Sparkle, {
    size: 22,
    color: "var(--purple-400)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '20%',
      top: 260
    }
  }, /*#__PURE__*/React.createElement(Sparkle, {
    size: 16,
    color: "var(--orange-500)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '10%',
      top: 70
    }
  }, /*#__PURE__*/React.createElement(BinaryBlock, {
    rows: 3,
    cols: 9,
    color: "var(--orange-400)",
    fontSize: 12
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '14%',
      top: 150
    }
  }, /*#__PURE__*/React.createElement(SquareCluster, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '12%',
      top: 250
    }
  }, /*#__PURE__*/React.createElement(SquareCluster, {
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '18%',
      top: 300
    }
  }, /*#__PURE__*/React.createElement(Sparkle, {
    size: 18,
    color: "var(--orange-500)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '8%',
      top: 200
    }
  }, /*#__PURE__*/React.createElement(Sparkle, {
    size: 20,
    color: "var(--purple-400)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(36px, 6vw, 64px)',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      color: 'var(--black)'
    }
  }, "Where Kids Don't Just Use Tech\u2014They Build It."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: 'var(--text-body)',
      maxWidth: 520,
      margin: '20px auto 0',
      lineHeight: 1.5
    }
  }, "Unlock your child's potential with unique step-by-step learning plans to help them discover their interests in STEM and inspire them to do their best."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      justifyContent: 'center',
      marginTop: 28,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onTrial
  }, "Book A Free Trial"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "Explore Programs"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 20,
      marginTop: 48,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    src: `${A}/photo-team.png`,
    tilt: -5,
    width: 190,
    style: {
      marginTop: 30
    }
  }), /*#__PURE__*/React.createElement(PhotoFrame, {
    src: `${A}/photo-build.png`,
    tilt: 2,
    width: 210,
    ratio: "1 / 1"
  }), /*#__PURE__*/React.createElement(PhotoFrame, {
    src: `${A}/photo-class.png`,
    tilt: -2,
    width: 200,
    style: {
      marginTop: 20
    }
  }), /*#__PURE__*/React.createElement(PhotoFrame, {
    src: `${A}/photo-team.png`,
    tilt: 5,
    width: 170,
    style: {
      marginTop: 40
    }
  })));
}
function Programs() {
  const items = [{
    img: `${A}/photo-team.png`,
    badge: 'Ages 8–12',
    title: 'Robotics Foundations',
    body: 'Build and program your first robots with guided, hands-on projects.'
  }, {
    img: `${A}/photo-build.png`,
    badge: 'Ages 10–14',
    title: 'Engineering Lab',
    body: 'Design mechanisms, wire circuits, and bring inventions to life.'
  }, {
    img: `${A}/photo-class.png`,
    badge: 'Ages 13+',
    title: 'Competitive Teams',
    body: 'Prep for regional and national robotics competitions as a team.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-wash)',
      padding: '72px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "orange"
  }, "Programs"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(28px,4vw,40px)',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      marginTop: 12
    }
  }, "A learning path for every young builder")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 24
    }
  }, items.map(it => /*#__PURE__*/React.createElement(Card, {
    key: it.title,
    image: it.img,
    badge: /*#__PURE__*/React.createElement(Badge, {
      color: "purple"
    }, it.badge),
    title: it.title,
    footer: /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        fontWeight: 700
      }
    }, "Explore \u2192")
  }, it.body)))));
}
function CTABand({
  onTrial
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--surface-inverse)',
      color: 'var(--white)',
      padding: '64px 24px',
      overflow: 'hidden',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '12%',
      top: 40,
      opacity: .5
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(BinaryBlock, {
    rows: 4,
    cols: 9,
    color: "var(--purple-300)",
    fontSize: 13
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '10%',
      bottom: 30
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(Sparkle, {
    size: 30,
    color: "var(--orange-500)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620,
      margin: '0 auto',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: 'var(--white)',
      fontSize: 'clamp(28px,4vw,40px)',
      fontWeight: 800,
      letterSpacing: '-0.02em'
    }
  }, "Ready to start building?"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--purple-200)',
      fontSize: 18,
      marginTop: 14
    }
  }, "Book a free trial class and watch curiosity turn into confidence."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    onClick: onTrial
  }, "Book A Free Trial"))));
}
function Footer() {
  const cols = [['Programs', ['Robotics', 'Engineering', 'Competitive Teams', 'Camps']], ['Company', ['About Us', 'Events & News', 'Careers', 'Contact']], ['Support', ['Student Portal', 'FAQ', 'Locations']]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--white)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '48px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(3, 1fr)',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 24,
      color: 'var(--purple-700)'
    }
  }, "WIZ"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 10,
      color: 'var(--gray-500)',
      letterSpacing: '0.18em'
    }
  }, "ROBOTICS")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--gray-500)',
      maxWidth: 240,
      marginTop: 12
    }
  }, "Robotics & playful STEM education that turns kids into builders.")), cols.map(([h, links]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--text-heading)',
      marginBottom: 12
    }
  }, h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 14,
      color: 'var(--gray-500)'
    }
  }, l))))))));
}
Object.assign(window, {
  WizHero: Hero,
  WizPrograms: Programs,
  WizCTABand: CTABand,
  WizFooter: Footer,
  WizNavBar: NavBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.BinaryBlock = __ds_scope.BinaryBlock;

__ds_ns.Sparkle = __ds_scope.Sparkle;

__ds_ns.SquareCluster = __ds_scope.SquareCluster;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.PhotoFrame = __ds_scope.PhotoFrame;

})();
