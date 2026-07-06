# Skill: Portfolio Design System

> **Status update (2026-07-06):** the token tables below describe the
> pre-redesign teal/amber dark system and are **superseded** by the live
> "Themishka" redesign merged in PR #6 (2026-07-03). The source of truth for
> tokens is `app/globals.css` (`@theme` block). Live system in brief:
> dark canvas `#1b1916`, cream paper `#f3efe6` / `#ebe5d8`, forest-green
> accent `#16a34a` (text-safe deep variant `#166534` on cream), hairline
> borders `#cdc7be` / `#2d2a26`, Fraunces display, Hanken Grotesk body,
> JetBrains Mono labels. Semantic Tailwind tokens: `bg-canvas`, `bg-paper`,
> `bg-paper-2`, `text-ink`/`-soft`/`-faint`, `text-on-dark`/`-soft`/`-faint`,
> `border-line`/`-dark`, `text-accent`/`-deep`. Sections alternate dark and
> cream; modals use cream surfaces; the AmveroPrototype stays dark
> (simulates the real product UI). The durable rules below that survive the
> redesign: no drop shadows on cards, `rounded-sm` corners (no pills), no
> stock illustrations/emoji, mono uppercase eyebrows, restraint over
> decoration.

Authoritative visual rules for Michael's portfolio site. Every styling decision must trace back to this document. When in conflict with ad-hoc choices made during a build session, this skill wins.

## Color palette

| Token | Hex | Usage |
|---|---|---|
| `canvas` | `#0a0a0a` | Page background |
| `surface` | `#111111` | Cards, elevated panels |
| `border` | `#1f1f1f` | Dividers, section rules |
| `text-primary` | `#f0ede8` | Headlines, body |
| `text-secondary` | `#8a8580` | Subheads, labels, supporting copy |
| `text-muted` | `#4a4742` | Tertiary — timestamps, section stubs |
| `teal` | `#5eead4` | Primary accent — CTAs, highlights, interactive states |
| `teal-dim` | `#5eead4` at 20% opacity | Hover fills, borders, glow layers |
| `amber` | `#f59e0b` | **Metric highlights only.** Reserved for outcome numbers (percentages, customer counts). Do not use for UI chrome. |

**Mode:** Dark by default. Light mode toggle is out of scope for v1. Never introduce light-mode defaults.

## Typography

| Role | Font | Source |
|---|---|---|
| Display / headlines | Fraunces | Google Fonts — `weight: 400, 600, 700`, both `normal` and `italic` styles. Use 700 for dominant headlines. |
| Body / UI | Geist Sans | Next.js built-in (`next/font/google`) |
| Mono / labels / diagram | Geist Mono | Next.js built-in (`next/font/google`) |

### CSS variables (set on `<html>`)
```
--font-display: var(--font-fraunces)
--font-sans: var(--font-geist-sans)
--font-mono: var(--font-geist-mono)
```

### Type scale rules
- **Hero headline:** Geist Sans 700, `clamp(2.2rem, 3.8vw, 3.4rem)`, leading `1.08`, tracking `-0.03em`. Confident sans-serif — Fraunces reads editorial, not product.
- **Case study / section titles:** Fraunces 600–700. Display serif reserved for section-level headings, not hero.
- **Display headlines (general):** `clamp(2.6rem, 5.5vw, 4.5rem)`, leading `1.05`, tracking `-0.01em`
- **Section subheads:** `1.5rem–2rem`, Fraunces, normal weight
- **Body copy:** `1rem–1.05rem`, Geist Sans, `leading-relaxed`
- **Section labels / eyebrows:** Geist Mono, `0.75rem`, `tracking-[0.2em]`, `uppercase`, teal
- **Metric callouts:** Instrument Serif italic or large weight, amber color
- **CTA / nav:** Geist Mono, `0.875rem`, `tracking-[0.08em]`, uppercase

## Layout

- **Max content width:** `max-w-5xl` (`80rem`) for the outer container; prose sections constrained to `max-w-[720px]`–`max-w-[880px]`
- **Horizontal padding:** `px-6` (mobile), scales with container
- **Full-bleed:** Hero background only. All other sections respect the content container.
- **Section anchors:** `id` attributes: `hero`, `work`, `practice`, `background`, `contact`
- **Section spacing:** `min-h-screen` for hero; generous `py-24`–`py-32` for content sections

## Motion

- **Scroll-triggered fades:** `.fade-in` class, `opacity: 0 → 1`, `translateY(18px → 0)`, `0.6s ease`. Use an `IntersectionObserver` hook.
- **No parallax.** No scroll-jacking. No heavy entrance animations.
- **One interactive moment allowed in Section 4** (AI practice diagram).
- Nav background: transparent → frosted glass (`backdrop-blur-md`, `bg-[#0a0a0a]/90`) on scroll past 40px.

## Component patterns

### Nav
- Fixed top, `z-50`
- Left: `MK` monogram in Geist Mono, muted
- Right: anchor links in Geist Mono, muted, teal on hover
- Border-bottom `border-[#1f1f1f]` appears with frosted glass on scroll

### Section labels (eyebrows)
Format: `[number] — [Section Name]`
Example: `001 — Michael Korman`, `002 — Work`, `003 — Work`, `004 — Practice`, `005 — Background`, `006 — Contact`

### Metric callouts
```
<span class="text-[#f59e0b] font-display italic">98%</span>
```
Amber, Instrument Serif, italic. Used inside outcome panels only.

### CTA button (primary)
- Border: `border border-[#5eead4]/40`
- Text: `text-[#5eead4]`
- Font: Geist Mono, small, uppercase, tracked
- Hover: `bg-[#5eead4]/8`, `border-[#5eead4]/70`
- Shape: `rounded-sm` (nearly square corners — not pill)

### Dividers
- `w-16 h-px bg-[#1f1f1f]` — short horizontal rule used to close a content block
- Full-width: `border-t border-[#1f1f1f]` between sections

## What not to do

- No gradients on text except teal accent words in headlines
- No drop shadows on cards (use `border-[#1f1f1f]` instead)
- No rounded-xl or pill shapes on structural elements
- No stock illustrations, icons packs, or emoji in content
- No white or near-white backgrounds anywhere
- Amber is never used for UI — only numbers in outcomes panels
- Do not introduce any new accent color
