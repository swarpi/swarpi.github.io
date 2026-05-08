# Design System — swarpi.github.io

> **Design intent:** Warm, tactile, paper-like. Bold confident typography creates hierarchy. Minimal color palette relies on opacity for text levels instead of multiple hues. Grain texture adds a physical, organic quality. Generous whitespace lets content breathe. The aesthetic should feel like a well-printed portfolio booklet — not a generic developer blog.

Inspired by [taamannae.dev](https://taamannae.dev/). Adapted for Astro 5 + vanilla CSS architecture.

---

## 1. Color System

### 1.1 Light Mode (default)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#f1f1ee` | Page background — warm cream, not pure white |
| `--color-bg-alt` | `#eaeae3` | Cards, code blocks, grouped surfaces |
| `--color-text` | `#000000` | Primary text — pure black for maximum contrast on cream |
| `--color-text-muted` | `rgba(0,0,0,0.45)` | Secondary text, descriptions, dates |
| `--color-text-dim` | `#898989` | Tertiary text, inactive nav, placeholders |
| `--color-border` | `rgba(0,0,0,0.12)` | Dividers, card edges, section separators |
| `--color-accent` | `#2563eb` | Functional links (blue kept for usability) |
| `--color-accent-hover` | `#1d4ed8` | Link hover state |
| `--color-nav-hover` | `rgba(0,0,0,0.06)` | Nav pill hover background |
| `--color-nav-active` | `rgba(0,0,0,0.08)` | Nav pill active/current background |
| `--color-footer-bg` | `#252525` | Footer — dark charcoal |
| `--color-footer-text` | `rgba(255,255,255,0.7)` | Footer body text |
| `--color-footer-heading` | `#ffffff` | Footer headings, links |

### 1.2 Dark Mode (warm variant)

Dark mode uses warm undertones (yellow-brown hue) instead of cold blue-gray to preserve the tactile aesthetic.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#1a1a17` | Warm dark background |
| `--color-bg-alt` | `#26261f` | Card/surface background |
| `--color-text` | `#f0efe8` | Warm off-white (not pure white) |
| `--color-text-muted` | `rgba(240,239,232,0.5)` | Secondary text |
| `--color-text-dim` | `#7a7a6e` | Tertiary text |
| `--color-border` | `rgba(240,239,232,0.12)` | Dividers |
| `--color-accent` | `#60a5fa` | Links |
| `--color-accent-hover` | `#93c5fd` | Link hover |
| `--color-nav-hover` | `rgba(255,255,255,0.06)` | Nav pill hover |
| `--color-nav-active` | `rgba(255,255,255,0.08)` | Nav pill active |
| `--color-footer-bg` | `#111110` | Footer — deeper dark |
| `--color-footer-text` | `rgba(240,239,232,0.5)` | Footer body text |
| `--color-footer-heading` | `#f0efe8` | Footer headings |

### 1.3 Workflow Page Tokens (`--wf-*`)

Updated to match the warm palette. These are defined in `global.css` alongside main tokens.

**Light:**
| Token | Value |
|-------|-------|
| `--wf-bg` | `oklch(0.95 0.01 85)` |
| `--wf-card` | `oklch(0.93 0.01 85)` |
| `--wf-card-hover` | `oklch(0.94 0.01 85)` |
| `--wf-text` | `oklch(0.0 0 0)` |
| `--wf-text-sec` | `oklch(0.45 0.01 85)` |
| `--wf-text-dim` | `oklch(0.6 0.01 85)` |
| `--wf-border` | `oklch(0.85 0.01 85)` |
| `--wf-border-strong` | `oklch(0.75 0.02 85)` |
| `--wf-shadow` | `oklch(0 0 0 / 0.06)` |
| `--wf-shadow-strong` | `oklch(0 0 0 / 0.15)` |
| `--wf-label-bg` | `oklch(0.95 0.01 85 / 0.9)` |
| `--wf-dot` | `oklch(0.68 0.03 85)` |

**Dark:**
| Token | Value |
|-------|-------|
| `--wf-bg` | `oklch(0.14 0.01 85)` |
| `--wf-card` | `oklch(0.19 0.01 85)` |
| `--wf-card-hover` | `oklch(0.22 0.01 85)` |
| `--wf-text` | `oklch(0.94 0.01 85)` |
| `--wf-text-sec` | `oklch(0.65 0.01 85)` |
| `--wf-text-dim` | `oklch(0.48 0.01 85)` |
| `--wf-border` | `oklch(0.28 0.01 85)` |
| `--wf-border-strong` | `oklch(0.38 0.015 85)` |
| `--wf-shadow` | `oklch(0 0 0 / 0.25)` |
| `--wf-shadow-strong` | `oklch(0 0 0 / 0.45)` |
| `--wf-label-bg` | `oklch(0.19 0.01 85 / 0.9)` |
| `--wf-dot` | `oklch(0.38 0.02 85)` |

Graph accent colors (indigo, green, amber, blue) in the React components remain unchanged — they provide semantic meaning in the graph visualization.

---

## 2. Typography

### 2.1 Font Loading

Both fonts loaded via Google Fonts in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Manrope:wght@200..800&display=swap" rel="stylesheet">
```

### 2.2 Font Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-display` | `'Fraunces', Georgia, 'Times New Roman', serif` | h1 headings, site name, hero text |
| `--font-body` | `'Manrope', system-ui, -apple-system, sans-serif` | Body text, h2-h6, nav, UI elements |
| `--font-mono` | `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace` | Code blocks (unchanged) |

**Migration from old tokens:**
| Old | New |
|-----|-----|
| `--font-serif` | `--font-display` |
| `--font-sans` | `--font-body` |
| `--font-mono` | `--font-mono` (unchanged) |

### 2.3 Type Scale

| Element | Font | Size | Weight | Line-height | Notes |
|---------|------|------|--------|-------------|-------|
| Hero h1 | `--font-display` | `clamp(2.5rem, 6vw, 5rem)` | 800 | 0.95 | Homepage hero, about page header |
| Page h1 | `--font-display` | `2.25rem` | 700 | 1.1 | Standard page titles |
| h2 | `--font-body` | `1.75rem` | 800 | 1.2 | Section headings |
| h3 | `--font-body` | `1.35rem` | 700 | 1.4 | Subsections, card titles |
| h4 | `--font-body` | `1.1rem` | 700 | 1.5 | Minor headings |
| Body | `--font-body` | `1rem` (18px) | 500 | 1.7 | Paragraph text |
| Body emphasis | `--font-body` | `1rem` | 600 | 1.7 | Important body text, bold descriptions |
| Small / meta | `--font-body` | `0.875rem` | 600 | 1.5 | Dates, tags, labels |
| Nav link | `--font-body` | `1rem` | 700 | — | Navigation items |
| Site name | `--font-display` | `1.35rem` | 700 | — | Header brand |
| Code | `--font-mono` | `0.9em` | 400 | 1.6 | Inline and block code |

### 2.4 Fraunces Variable Axes

Fraunces supports these variable axes for fine-tuning:
- `opsz` (optical size): 9–144. Use higher values at display sizes for refined strokes.
- `SOFT` (softness): 0–100. Higher = rounder serifs. Default 0.
- `WONK` (wonkiness): 0–1. Set to 1 for the distinctive asymmetric character.

Recommended hero usage:
```css
font-variation-settings: 'opsz' 144, 'WONK' 1;
```

---

## 3. Spacing & Layout

### 3.1 Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.5rem` (8px) | Tight gaps, icon padding |
| `--space-sm` | `1rem` (16px) | Inline spacing, mobile padding |
| `--space-md` | `2rem` (32px) | Base section padding, card padding, grid gap |
| `--space-lg` | `4rem` (64px) | Section separators, major content gaps |
| `--space-xl` | `6rem` (96px) | Page top spacing, hero margins |
| `--space-2xl` | `10rem` (160px) | Large decorative spacing (use sparingly) |

### 3.2 Layout System

**Max width:** `1200px` (replaces `70ch` / ~630px)

**Grid:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-md); /* 32px */
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-md);
}
```

**Common span patterns:**
- Full width: `grid-column: 1 / -1`
- Wide content: `grid-column: span 8` (readable prose width)
- Half: `grid-column: span 6`
- Third: `grid-column: span 4`
- Cards: 3-column grid → 2-column at `≤1048px` → 1-column at `≤730px`

**Container:** `<main>` remains the primary container with `max-width: var(--max-width)`, `margin: 0 auto`, and `padding-top: var(--space-xl)` to clear the fixed header.

### 3.3 Responsive Breakpoints

| Name | Value | Behavior |
|------|-------|----------|
| `--bp-sm` | `576px` | Stack to single column |
| `--bp-md` | `768px` | Two-column layouts collapse |
| `--bp-lg` | `1024px` | Nav collapses to mobile |
| `--bp-xl` | `1280px` | Max content width reached |

---

## 4. Visual Effects

### 4.1 Grain Texture Overlay

A full-viewport noise texture that gives the site a tactile, printed quality.

**Implementation:** Inline SVG `<feTurbulence>` filter in `BaseLayout.astro`:

```html
<svg class="grain" aria-hidden="true">
  <filter id="grain-filter">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  <rect width="100%" height="100%" filter="url(#grain-filter)" />
</svg>
```

```css
.grain {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0.45;
}

[data-theme="dark"] .grain {
  opacity: 0.25;
}
```

The SVG approach is zero-dependency, loads instantly, and scales to any viewport without tiling artifacts.

### 4.2 Gradient Blur (Navigation Backdrop)

Progressive blur behind the fixed header. Multiple layers of increasing `backdrop-filter: blur()` with CSS mask gradients create a smooth fade from sharp to blurred.

```css
.nav-blur {
  position: absolute;
  inset: 0;
  z-index: -1;
  height: 130%;
}

.nav-blur::before {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  mask: linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%);
  -webkit-mask: linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%);
}
```

For simplicity, we use a single-layer blur with mask gradient rather than the reference's 8-layer approach. The visual effect is nearly identical at a fraction of the complexity.

### 4.3 Card Hover

```css
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: scale(1.03);
}
```

Subtle 3% scale (not the reference's 5%) to keep it refined.

### 4.4 Link Styling

```css
a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--color-accent-hover);
}
```

No underline by default. Hover changes color. Underline can be added contextually for prose content links.

---

## 5. Component Specs

### 5.1 Navigation / Header

```
┌─────────────────────────────────────────────────────────────┐
│  swarpi          Home  Workflow  Projects  Writing  About 🌓│
│  (display font)  (pill links, Manrope 700)         (toggle)│
└─────────────────────────────────────────────────────────────┘
  ░░░░░░░░░░░░░ gradient blur fades out ░░░░░░░░░░░░░░░░░░░░░
```

| Property | Value |
|----------|-------|
| Position | `fixed`, top 0, full width |
| Z-index | `999` |
| Padding | `var(--space-md)` (32px) horizontal, `var(--space-sm)` vertical |
| Background | Transparent (blur backdrop handles opacity) |
| Site name | `--font-display`, `1.35rem`, weight 700 |
| Nav links | `--font-body`, `1rem`, weight 700, `padding: 8px 16px`, `border-radius: 100px` |
| Link hover | `background-color: var(--color-nav-hover)` |
| Link active | `background-color: var(--color-nav-active)`, `color: var(--color-text)` |
| Theme toggle | Small icon button (sun/moon), same pill styling as nav links |
| Mobile | Hamburger at `≤1024px`, slide-down or dropdown menu |

### 5.2 Footer

```
┌─────────────────────────────────────────────────────────────┐
│  ██████████████████████████████████ (--color-footer-bg)     │
│                                                             │
│  swarpi                    GitHub · RSS · Email             │
│  (display font, white)     (footer links)                   │
│                                                             │
│  © 2025 Trung Duc Nguyen                                    │
│  (muted text)                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `var(--color-footer-bg)` |
| Padding | `var(--space-lg)` (64px) vertical, `var(--space-md)` horizontal |
| Text color | `var(--color-footer-text)` for body, `var(--color-footer-heading)` for links |
| Layout | Flexbox, space-between, max-width container centered |
| Border-top | `1px solid rgba(255,255,255,0.1)` |

### 5.3 Project Card

```
┌──────────────────────────────┐
│  ████████████████████████████│  ← preview image (optional)
│  ████████████████████████████│    background-size: cover
│  ████████████████████████████│    border-radius: 12px 12px 0 0
├──────────────────────────────┤
│                              │
│  Project Name                │  ← h3, --font-body, 700
│  Short description text      │  ← p, --color-text-muted
│                              │
│  TypeScript · 2024           │  ← meta, --space-xs gap
│                              │
└──────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `var(--color-bg-alt)` |
| Border-radius | `12px` |
| Padding | `var(--space-md)` for content area |
| Hover | `transform: scale(1.03)`, `transition: 0.3s ease` |
| Title | h3, `--font-body`, 700 weight |
| Description | `--color-text-muted`, 500 weight |
| Meta | `0.875rem`, `--color-text-dim`, 600 weight |
| Grid | 3 columns, `gap: var(--space-md)` |

### 5.4 Base Layout

| Property | Value |
|----------|-------|
| Body bg | `var(--color-bg)` |
| Body font | `var(--font-body)` |
| Body color | `var(--color-text)` |
| Main max-width | `var(--max-width)` (1200px) |
| Main padding-top | `var(--space-xl)` (96px, clears fixed header) |
| Main padding-sides | `var(--space-md)` (32px) |
| Main padding-bottom | `var(--space-lg)` (64px) |
| Grain overlay | Fixed, full viewport, above everything |

---

## 6. Page-by-Page Notes

### 6.1 Homepage (`/`)

- **Hero:** Large Fraunces h1 at `clamp(2.5rem, 6vw, 5rem)` with `font-variation-settings: 'opsz' 144, 'WONK' 1`
- **Tagline:** Manrope 600, `--color-text-muted`, `1.1rem`
- **Explore links:** Replace simple `<ul>` with visually richer cards or a styled link list with descriptions. Each link gets its own row with title + description.
- **Layout:** Single-column, centered, generous vertical spacing (`var(--space-xl)` between hero and links)

### 6.2 About Page (`/about`)

- **Header:** Hero-sized Fraunces heading
- **Bio:** Prose in ~8-column span for readability
- **Skills/experience:** Grid layout with `border-top: 1px solid var(--color-border)` dividers between sections
- **Timeline entries:** `var(--space-lg)` gap between entries, dates in `--color-text-dim`
- **Photo:** `border-radius: 12px`, natural aspect ratio

### 6.3 Projects Grid (`/projects`)

- 3-column card grid using `.grid` with cards spanning 4 columns each
- Responsive: 2 columns (span 6) at `≤1048px`, 1 column at `≤730px`
- Page title in Fraunces
- Optional intro text in Manrope muted

### 6.4 Project Detail (`/projects/[slug]`)

- Wider content area (full `--max-width`)
- Project meta (language, stars, dates) in a horizontal bar with `--color-text-dim`
- README content styled with prose typography

### 6.5 Writing (`/writing`)

- Article list with title, date, description per entry
- Entries separated by `border-bottom: 1px solid var(--color-border)`
- Dates right-aligned or above title in small/dim text

### 6.6 Workflow (`/workflow`)

- Bypasses `BaseLayout` — has its own `<html>` template
- `--wf-*` tokens updated to warm palette in `global.css`
- Needs its own grain overlay (add SVG to `workflow.astro` directly)
- ThemeToggle import needs updating to match new simplified version

---

## 7. Accessibility Notes

| Combination | Contrast Ratio | WCAG AA |
|-------------|---------------|---------|
| `#000` on `#f1f1ee` | 18.1:1 | Pass |
| `rgba(0,0,0,0.45)` on `#f1f1ee` | ~7.5:1 | Pass |
| `#898989` on `#f1f1ee` | 3.5:1 | Fail (large text only) |
| `#f0efe8` on `#1a1a17` | 15.2:1 | Pass |
| `rgba(240,239,232,0.5)` on `#1a1a17` | ~6.8:1 | Pass |
| `#7a7a6e` on `#1a1a17` | 3.8:1 | Fail (large text only) |

`--color-text-dim` (#898989 / #7a7a6e) fails WCAG AA for small text. Use only for large text (≥18px bold or ≥24px) or decorative/non-essential labels. For essential secondary text, use `--color-text-muted` instead.

---

## 8. Implementation Checklist

| # | File | Status |
|---|------|--------|
| 1 | `src/styles/global.css` — all tokens, spacing, grid, typography | |
| 2 | `src/layouts/BaseLayout.astro` — font links, grain overlay, main spacing | |
| 3 | `src/components/Header.astro` — fixed nav, pill links, blur backdrop | |
| 4 | `src/components/ThemeToggle.astro` — simplify to icon button | |
| 5 | `src/components/Footer.astro` — dark bg, expanded layout | |
| 6 | `src/components/ProjectCard.astro` — new card design | |
| 7 | `src/pages/index.astro` — hero + explore section redesign | |
| 8 | `src/pages/about.astro` — full page redesign | |
| 9 | `src/pages/projects/index.astro` — grid layout | |
| 10 | `src/pages/projects/[slug].astro` — content styling | |
| 11 | `src/pages/writing/index.astro` — list styling | |
| 12 | `src/pages/workflow.astro` — wf-tokens, grain, theme toggle | |

---

## 9. What Is Not Changing

- Astro 5 framework, static output mode
- React island components (ProjectGrid, OrchestrationGraph, ArchitectureGraph) — internal logic unchanged, only token values update
- MDX content pipeline and `src/content/` structure
- GitHub API data fetching
- RSS feed generation
- Path aliases (`@/*` → `src/*`)
- Existing page routes
