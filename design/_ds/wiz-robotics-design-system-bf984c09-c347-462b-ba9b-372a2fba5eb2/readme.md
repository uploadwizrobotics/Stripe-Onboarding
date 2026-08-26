# WIZ Robotics — Design System

A brand + UI design system for **WIZ Robotics**, a robotics and playful STEM education platform for kids. The brand voice is energetic, encouraging, and parent-facing; the visuals pair a confident **purple** with a high-energy **orange**, scattered with playful "builder" motifs (binary rain, pixel blocks, sparkles).

## Sources
- `uploads/Screenshot 2026-07-10 at 2.57.53 PM.png` — website homepage (hero, header, photo collage).
- `uploads/Screenshot 2026-07-10 at 3.26.38 PM.png` — brand selection-color swatch list.
- No codebase or Figma file was provided; the system is reconstructed from the two screenshots plus the user's direction (purple + orange primaries, hero as the theme). Values sampled from the swatch list are exact; layout/spacing are close approximations of the screenshot.

## Brand at a glance
- **Purple** `#6941C6` — primary. **Orange** `#FF9100` — accent/energy. Deep purple `#3B2470` for the header/utility bar and dark bands.
- Lavender wash `#F9F5FF` for soft section backgrounds.
- Rounded, friendly geometry; pill buttons; soft purple-tinted shadows.

---

## CONTENT FUNDAMENTALS
**Voice:** warm, aspirational, and confident — speaks to *parents* about their *child*. Benefit-led, never jargon-heavy.

- **Person:** second person to the parent ("Unlock **your child's** potential"), third person about the kid. Occasional collective ("young builders").
- **Casing:** Headlines use sentence-ish case with strong Title Case on CTAs ("Book A Free Trial", "Explore Programs"). Nav items are Title Case ("Events & News").
- **Tone:** punchy, active verbs — *build, unlock, discover, inspire*. Short declaratives. Em-dashes for a beat of drama ("Where Kids Don't Just Use Tech—They Build It.").
- **Contractions:** yes ("Don't", "child's") — keeps it human and friendly.
- **Emoji:** essentially none in brand copy. The signature "tech" flourish is the **binary-code motif**, not emoji. (One celebratory 🎉 appears only in the demo trial-booked toast, not core brand copy.)
- **Numbers/stats:** minimal — no data-slop. Age ranges ("Ages 8–12") are the main structured detail.
- **Example headline:** "Where Kids Don't Just Use Tech—They Build It."
- **Example body:** "Unlock your child's potential with unique step-by-step learning plans to help them discover their interests in STEM and inspire them to do their best."
- **Example CTAs:** "Book A Free Trial" (primary), "Explore Programs" (secondary), "Student Portal ↗" (utility).

## VISUAL FOUNDATIONS
- **Color:** two-hue system. Purple family (primary, `--purple-*`) + orange family (accent, `--orange-*`) on white and lavender-wash backgrounds. Dark deep-purple (`--purple-900`) for the top utility bar and CTA bands. Neutrals are cool grays for text/borders.
- **Type:** display = **Poppins** (geometric, friendly, extrabold headlines with −0.02em tracking); body = **Nunito Sans** (rounded humanist, 1.5 line-height); mono = **Space Mono** for the binary motif. *(All three are Google Fonts substitutions — see Font substitutions below.)*
- **Backgrounds:** mostly clean white and soft lavender (`--surface-wash`) panels; dark purple bands for emphasis. No heavy gradients, no photographic full-bleed hero — instead a **tilted photo collage** of real kids building.
- **Decorative motifs:** scattered, low-density, absolutely-positioned — **binary rain** (0/1 grids), **pixel blocks** (2×2 rounded squares in purple/orange), and **4-point sparkles**. These signal "code + play". Use sparingly around hero/CTA edges.
- **Imagery:** warm, candid, in-the-moment photos of kids at workbenches with robotics kits. Framed with one oversized rounded corner and a slight rotation (±2–5°).
- **Corner radii:** generous — 8/12/16/24px; buttons and badges are full pills (999px). Photo frames use an asymmetric `18px 18px 18px 40px`.
- **Cards:** white, `--radius-lg` (16px), 1px subtle border, soft shadow (`--shadow-sm`); lift `translateY(-4px)` to `--shadow-lg` on hover with a bouncy ease.
- **Shadows:** soft and purple-tinted (`rgba(59,36,112,…)`), never harsh black. Primary buttons carry a subtle brand glow.
- **Motion:** playful. Standard ease `cubic-bezier(0.4,0,0.2,1)`; signature **bounce** `cubic-bezier(0.34,1.56,0.64,1)` for presses and card lifts. Durations 120/200/320ms.
- **Hover states:** links darken (purple-600 → purple-800); cards lift + deepen shadow.
- **Press states:** buttons scale to `0.96` with the bounce ease (tactile "squish").
- **Borders:** 1px `--gray-200/300`; secondary buttons use a 2px neutral border.
- **Transparency/blur:** minimal — the brand favors solid, confident fills over glassmorphism.
- **Layout:** centered hero, max content ~720px; section container max 1200px. Symmetric, airy, generous vertical padding (64–80px sections).

## ICONOGRAPHY
- The source screenshots show **no dedicated icon set** beyond a small "↗" arrow glyph (external/utility links) and the "EN/中文" language pill. There is no built-in icon font or SVG sprite evident.
- Approach: keep iconography minimal. Use Unicode arrows (`↗`, `→`) for links/CTAs as the source does. Where a broader UI needs icons, substitute **Lucide** (CDN, 2px rounded stroke — matches the friendly geometry); this is a **substitution**, flagged here, not something present in the source.
- **Emoji:** not used in brand copy (one 🎉 in the demo toast only).
- The **binary-code / pixel-block / sparkle** motifs act as the brand's decorative "icon language" — they are provided as components (`BinaryBlock`, `SquareCluster`, `Sparkle`) rather than an icon font.
- **Logo:** the source header shows a small gear/robot glyph + "WIZ ROBOTICS" wordmark. The glyph is too low-resolution to extract cleanly and must not be reconstructed from memory, so **no logo mark asset is included**. The system uses a **typographic wordmark** (bold "WIZ" + spaced "ROBOTICS"). *Please provide the real logo files.*

## Font substitutions ⚠️
The source did not include font files. Substituted with Google Fonts approximations:
- Display → **Poppins** · Body → **Nunito Sans** · Mono → **Space Mono**.
Please share the real brand fonts (or confirm these) and any logo/icon assets.

---

## Index / Manifest
Root:
- `styles.css` — global entry (imports only). Consumers link this.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `readme.md` — this file. `SKILL.md` — portable skill wrapper.
- `assets/` — `photo-team.png`, `photo-build.png`, `photo-class.png` (hero collage photos).

### Components
- **Core** (`components/core/`): `Button`, `Badge`, `Card`
- **Decor** (`components/decor/`): `Sparkle`, `BinaryBlock`, `SquareCluster`
- **Site** (`components/site/`): `NavBar`, `PhotoFrame`

### UI kits
- **Website** (`ui_kits/website/`): `index.html` — full marketing homepage (NavBar → Hero → Programs → CTA band → Footer), composed from the components. Also registered as a Starting Point.

### Foundation cards (Design System tab)
- Colors: Purple, Orange, Neutrals, Semantic Roles
- Type: Display, Body, Mono
- Spacing: Scale, Radii & Elevation
- Brand: Wordmark, Playful Motifs

### Intentional additions
- `Sparkle` / `BinaryBlock` / `SquareCluster` — the source has no formal component library; these codify the recurring decorative motifs so consumers reuse them consistently instead of re-drawing.
