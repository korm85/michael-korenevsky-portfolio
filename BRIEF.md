# Portfolio Site Brief

## Purpose

A personal portfolio site for Michael Korenevsky, Senior Product Manager at Oqton. Shared with recruiters and hiring managers during job applications. The site proves Michael ships real AI products at enterprise scale.

This document is the **source of truth for content, structure, and architecture**. The `portfolio-design-system` skill governs visual rules. The four custom skills in `.claude/skills/` enforce voice, IP handling, content sourcing, and deployment.

Read all of these before starting work.

## Audience

Recruiters and hiring managers at B2B enterprise software companies, with bias toward AI-native and agentic AI PM roles. They will spend 30–90 seconds. The site is optimized for that window: key outcomes are visible without clicking, and case-study depth is one click away.

Two critical constraints:

1. **Enterprise, not SaaS.** The products are enterprise software with on-premise and cloud deployment. Never call them SaaS.
2. **AI vs. physics distinction.** AMVero is AI-powered (computer vision). Simulation is physics-based, not AI. Never blur this line.

See `portfolio-copy-voice` and `ip-handling` skills.

## Design language

**Mode:** Dark canvas. No light mode. No toggle.

**Palette (from `globals.css`):**

| Token | Hex | Usage |
|---|---|---|
| `canvas` | `#000000` | Page background |
| `surface` | `#111213` | Cards, elevated panels |
| `border-dark` | `#232426` | Dividers, card borders |
| `text-primary` | `#ffffff` | Headlines, body |
| `text-secondary` | `#e2e8f0` | Subheads, supporting copy |
| `text-muted` | `#94a3b8` | Labels, timestamps |
| `teal-accent` | `#5eead4` | Primary accent — CTAs, eyebrows, highlights, interactive states |
| `teal-accent-dim` | `rgba(94,234,212,0.1)` | Hover fills, glow layers |

Amber (`#f59e0b`) is intentionally mapped to teal-accent in the theme — metric callouts use teal for consistency.

**Typography:**

| Role | Font |
|---|---|
| Body / UI | Poppins (`--font-sans`) |
| Display / section headings | Hepta Slab (`--font-display`) |
| Mono / labels / eyebrows | JetBrains Mono (`--font-mono`) |

**Motion:**
- Scroll-triggered reveals: `.scroll-reveal` class, `opacity 0→1`, `translateY 24px→0`, 600ms
- Modal entrance: `scaleIn` + `fadeIn` keyframes (250ms)
- Custom follower cursor: teal ring, desktop only, scales on hover over interactive elements (`z-[9999]`)
- Nav: transparent → `bg-canvas/90 backdrop-blur-md` after scroll past 40px

## Architecture: scrolling single-page

### Layout

- Single continuous page with anchor sections
- Fixed top nav (centered links, mobile hamburger)
- No sidebar nav (the TimelineNav component exists but is currently unused on the main page)
- Sections flow vertically; hero is full-screen, all others use `py-32`
- `max-w-5xl` content container, `px-6 md:px-12`

### Section structure

| Section ID | Component | Role |
|---|---|---|
| `hero` | inline in `page.tsx` | Full-screen intro: photo, tagline, CTAs, customer names |
| `work` | `SelectedWork` | Two `WorkCard` entries — AMVero and Simulation |
| `how-i-work` | `HowIWork` | AI practice / multi-agent workflow |
| `career` | `CareerTimeline` | Dual-column timeline, year indexes, role cards |
| `about` | inline in `page.tsx` | Education + languages grid |
| `contact` | `ContactSection` | Email, LinkedIn, resume links |

**Additional routes:**
- `/dashboard` — session status dashboard (internal tool)
- `/site-build` — how the site was built, pipeline diagram

### WorkCard pattern (SelectedWork)

Each product has:
1. Eyebrow (teal mono label)
2. 16:9 product image with role tag overlay (hover scales 1.02)
3. Two-column layout: left = title + description + CTA button; right = 2×2 metric grid + document badges
4. Customer quote block (border-left accent, italic)
5. CTA opens a modal: AMVero → `AmveroModal`, Simulation → `SimulationModal`

### Modals

Two full-screen modals with `fixed inset-0 z-50` overlay:

- **AmveroModal** — 12-col grid: left rail (overview) + right panel (interactive `AmveroPrototype` fleet console). Dark surface, teal accents.
- **SimulationModal** — ROI calculator (`RoiCalculator`) with sliders for cost/volume inputs. Dark surface, teal accents.

Modals are triggered by CTA buttons in `SelectedWork`. They are **not** replaced by expand-in-place — the modal pattern is intentional for the depth of interactive content they contain.

## Content rules

**Positioning sentence:**
> Building enterprise AI and predictive tools for high-stakes industries.

**Hero tagline:**
> Building complex products from scratch, owning the end-to-end process to transform complex data into actionable insights.

**Customer names (verified):** Baker Hughes · Thales · Elos Medtech · 3D Systems · Beehive

**Metrics (verified, sourced from DRIVE-DATA.md):**

*AMVero:*
- 98% reduction in active monitoring time (Baker Hughes)
- 18% scrap cost reduction (aerospace client)
- 136h saved per printer per year
- 5 enterprise clients in 5 months

*Simulation:*
- 80% fewer manufacturing errors
- 99%+ dimensional accuracy via predictive compensation
- <150µm maximum measured dimensional deviation

Do not invent metrics. Do not restore removed metrics. Source all numbers from `DRIVE-DATA.md`.

## Build target

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, deployed to Vercel free tier.

## Out of scope for v1

- Light mode
- Bento grid layout (deprecated from earlier iteration)
- Expand-in-place tile interactions (modals are the chosen pattern)
- Dark mode toggle
- Hebrew version
- Blog or articles
- Chatbot or AI Q&A
- Form submissions (contact is links only)
- Custom domain (can be added later)
- Multiple modals open simultaneously
