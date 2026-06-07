# Portfolio Site Brief

## Purpose

Personal portfolio for Michael Korenevsky, Senior PM at Oqton. Shared with recruiters and hiring managers during job applications. The site proves Michael ships real AI products at enterprise scale and runs an AI-native PM practice.

Live at `themishka.me`. Deployed via Vercel GitHub integration from `github.com/korm85/michael-korenevsky-portfolio`.

## Audience

Recruiters and hiring managers at B2B enterprise software companies, biased toward AI-native and agentic PM roles. 30–90 second attention window. Every section must earn its place.

Two hard constraints:
1. **Enterprise, not SaaS.** On-premise and cloud deployments. Never call them SaaS.
2. **AI vs. physics distinction.** AMVero is AI-powered (computer vision). Simulation is physics-based. Never blur this line.

## Design system

### Palette

| Token | Value | Used on |
|---|---|---|
| `--color-canvas` | `#1b1916` | Dark sections background |
| `--color-paper` | `#f3efe6` | Cream sections background |
| `--color-paper-2` | `#ebe5d8` | Deeper cream (About section, modal headers) |
| `--color-accent` | `#16a34a` | Forest green — metric values, quote marks, status dot, progress bar |
| `--color-accent-deep` | `#15803d` | Hover state for accent |
| `--color-on-dark` | `#f0ebe0` | Primary text on dark sections |
| `--color-on-dark-soft` | `#b3ab9b` | Secondary text on dark sections |
| `--color-on-dark-faint` | `#75705f` | Tertiary text on dark sections |
| `--color-ink` | `#1b1916` | Primary text on cream sections |
| `--color-ink-soft` | `#514c42` | Secondary text on cream sections |
| `--color-ink-faint` | `#8b8478` | Tertiary / labels on cream sections |
| `--color-line` | `#cdc7be` | Borders on cream sections |
| `--color-line-dark` | `#2d2a26` | Borders on dark sections |

### Typography

| Variable | Font | Used on |
|---|---|---|
| `--font-display` | Fraunces (variable, weights 300–600, normal + italic) | Headings, pullquotes, metric values |
| `--font-sans` | Hanken Grotesk (weights 400–700) | Body text, descriptions |
| `--font-mono` | JetBrains Mono (weights 400–500) | Section numbers, labels, doc chips, nav |

All heading sizes use `clamp()` for fluid scaling across viewport widths.

### Layout pattern: sections

Long-scroll page. Sections alternate dark and cream:

```
Hero          — dark (bg-canvas)
Selected Work — cream (bg-paper)
AI Practice   — dark (bg-canvas)
Career        — cream (bg-paper)
About         — deeper cream (bg-paper-2)
Contact       — dark (bg-canvas)
Footer        — dark (bg-canvas)
```

Section max-width: `1180px`, centered. Padding: `px-6 py-14 md:py-24 xl:py-32`.

Section header pattern:
```jsx
<div className="flex items-baseline gap-4 border-b border-line pb-6 mb-16">
  <span className="font-mono text-[11px] text-accent tracking-[0.1em]">01</span>
  <h2 className="font-display font-light ...">Section title</h2>
</div>
```

### Layout pattern: crow rows

Label + content two-column rows. Used in About and Contact sections.

```jsx
<div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] gap-4 items-baseline py-5 border-b border-line">
  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">Label</span>
  <div>content</div>
</div>
```

### Layout pattern: border-grid metrics

Creates a shared-border table with no double-borders:

```jsx
// Container
<div className="grid border-r border-b border-line grid-cols-2 md:grid-cols-4">
  // Each cell
  <div className="border-t border-l border-line p-5">
    <div className="font-display text-accent font-light">98%</div>
    <div className="font-mono text-[9px] text-ink-faint">Label</div>
  </div>
</div>
```

### Layout pattern: pullquote

```jsx
<blockquote className="font-display font-light italic text-ink-soft">
  <span className="text-accent not-italic">&ldquo;</span>
  Quote text here
  <span className="text-accent not-italic">&rdquo;</span>
</blockquote>
```

## Page sections

### Hero

Dark, full-viewport. Subtle grid pattern overlay + radial vignette. Pulsing green status dot. Fraunces name at `clamp(3.4rem, 11.5vw, 9.5rem)`. Two CTAs: "View Work" (filled) and "Get in Touch" (outlined). Company logos strip below.

### Selected Work (01)

Cream. Two `WorkArticle` components stacked with `space-y-14 md:space-y-20`.

Each article:
- 2-col grid (image + content) on desktop, stacked on mobile. Image always first in DOM; `md:order-last` for right-image articles.
- Image is **clickable** — opens `ImageOverlay` (full-screen lightbox). `cursor-zoom-in` + subtle hover scale signals affordance.
- Decision bullets with optional inline doc chip. If `docOverlay: true`, chip opens `RoiOverlay` instead of new tab.
- Border-grid metrics (2 cols mobile, 3–4 cols desktop).
- Fraunces italic pullquote with green quote marks.
- Doc chips at bottom: `text-ink-soft` at rest (not faint — must be readable), accent on hover. If `overlay: true`, opens `RoiOverlay`.

**AMVero article**: 4 metrics, 6 doc chips, Credit Pricing Model opens via RoiOverlay.
**Simulation article**: 3 metrics, 3 doc chips, no overlay docs.

### AI-Native PM Practice (02)

Dark. 4-card grid using `repeat(auto-fit, minmax(260px, 1fr))`. Cards: `p-8 border border-line-dark hover:border-accent/40`.

Copy framing rule: **first-person, specific outcome, tied to named project.** Not marketing language. Not "AI can do X" — "AI enabled me to achieve Y in project Z."

Current cards: Discovery & specs, Prototyping, Market intelligence, Support intelligence.

### Career Timeline (03)

Cream. Crow rows for each role. Years in accent mono. Company in Fraunces light. Fraunces italic closing statement.

### About (04)

Deeper cream. Profile photo `aspect-[4/5]`, max-width 340. Crow rows for Education, Languages, Location.

### Contact (05)

Dark. Crow rows for Email, LinkedIn, Resume, Portfolio PDF. Each row is an anchor with arrow icon that appears on hover.

### Footer

Dark. Mono labels: copyright, ISR live time (updates every 30s), green availability dot.

## Components

### Header

Fixed, full-width. Forest green 2px scroll progress bar at very top (`z-[90]`). MK monogram left, nav links right. Transparent on load, gains cream backdrop blur after scrolling. Link colors shift from `on-dark-soft` to `ink-soft` on scroll.

### AmveroModal

Opens from "Try interactive prototype" CTA. Cream shell (`bg-paper`). Contains `AmveroPrototype` which stays dark intentionally — simulates real product UI.

### SimulationModal

Opens from "Explore case study" CTA. Cream shell. Overview + metrics + source documents. No ROI tab (was removed — AMVero content misplaced there).

### RoiOverlay

Opens when Credit Pricing Model doc chip is clicked (inline or bottom chips). Full-screen overlay. Contains `/tools/amvero-roi-optimizer.html` in an iframe. Zoom controls (+/−, 75%–200%) inject CSS zoom into iframe body via `contentWindow` (same-origin). Escape or backdrop click to close.

### ImageOverlay

Opens when either article hero image is clicked. Full-screen dark backdrop, image centered with `object-contain`. `cursor-zoom-out` on backdrop. Escape or backdrop click to close.

## What to avoid

- Em dashes in body copy
- Marketing language in the AI Practice section ("AI-powered workflows that accelerate delivery")
- Calling simulation AI
- Bento grid / expand-in-place patterns (previous design, replaced)
- Custom cursor (removed — was gimmicky)
- `text-ink-faint` for interactive elements — use `text-ink-soft` minimum so links are readable at rest
- Inline `style={{ gridTemplateColumns }}` without responsive breakpoints — use Tailwind `md:` classes instead

## Build

Next.js 16+ (App Router), TypeScript, Tailwind CSS v4 (`@theme` directive for design tokens), deployed to Vercel via GitHub integration. Static pages. No backend.

Tailwind v4 note: design tokens are defined in `app/globals.css` under `@theme {}`. They become utility classes automatically (`bg-canvas`, `text-accent`, `border-line`, etc.).
