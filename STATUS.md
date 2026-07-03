# Portfolio Project Status

## Current state

Full visual redesign complete and live on `themishka.me`. Dark/cream/forest-green palette (Themishka-inspired), Fraunces display serif, Hanken Grotesk body. Long-scroll layout with alternating dark/cream sections. All modals, overlays, and mobile layouts are production-ready. Site deployed from `github.com/korm85/michael-korenevsky-portfolio` via Vercel GitHub integration.

## Last completed

- 2026-07-03: Full UX/positioning/engineering audit written to AUDIT.md (PR #3). Key findings: IP-policy conflict between site content and ip-handling skill, non-linkable case study modals, missing resume, public /dashboard, contrast failures, leaked-listener React bug.
- 2026-07-03: Two comparison variations implemented as preview branches. PR #4 `feat/content-improvements` (copy only: positioning-led hero, metric defensibility fixes, jargon removal). PR #5 `feat/ux-improvements` (behavior only: hash-synced deep-linkable modals, listener-leak fix, dialog a11y, next/image, WCAG contrast tokens, OG metadata, ~5MB dead asset cleanup).
- 2026-06-08: Pushed Themishka redesign to official repo and deployed to `themishka.me`. Replaced Emily Beal gold/bento design entirely.
- 2026-06-08: Added image lightbox, RoiOverlay with zoom controls, doc chips visible at rest.
- 2026-06-08: Removed ROI Simulator tab from SimulationModal; rewrote HowIWork cards; fixed mobile layout.

## In progress

Two variation branches awaiting review on Vercel previews (PRs #4 and #5). Both build green and are smoke-tested; either or both can merge to main independently.

## Next up

- Decide the three open questions from the audit: (1) IP policy vs. site content — update skill or scrub content; (2) restore a resume PDF; (3) remove or gate /dashboard on production
- Review PR #4 (content) and PR #5 (UX) previews; merge the keepers
- Review themishka.me on real mobile device after DNS propagation
- Consider adding Credit Pricing Model as a tab inside AmveroModal

## Decisions log

- **Themishka-inspired layout, not bento grid**: Replaced the expand-in-place bento grid with a linear long-scroll page. Sections alternate dark canvas (`#1b1916`) and cream paper (`#f3efe6`). Cleaner for recruiters who scan vertically.
- **Forest green accent `#16a34a`**: Replaces gold `#b08e4f`. Pairs with cream without the corporate-finance connotation of gold. Used for metric values, quote marks, status dot, scroll progress bar.
- **Custom cursor removed**: Was a visual gimmick with no recruiter value. Removed entirely.
- **ROI Simulator moved out of SimulationModal**: The iframe loaded AMVero pricing content inside the Simulation case study — wrong context. Removed the tab entirely. Credit Pricing Model now opens via its own RoiOverlay component with zoom controls.
- **Doc chip visibility**: Default `text-ink-faint` was too low contrast on cream. Changed to `text-ink-soft` at rest, accent on hover.
- **Image lightbox**: Hero images for both work articles open as a full-screen overlay on click. `cursor-zoom-in` signals affordance. Subtle scale-on-hover as a secondary hint.
- **HowIWork copy framing**: Cards are first-person "AI enabled me to achieve X" — specific outcomes tied to named projects. Not generic PM productivity claims.
- **Modals use cream surfaces**: AmveroModal and SimulationModal use `bg-paper`/`bg-paper-2` — cream, not dark. AmveroPrototype stays dark intentionally (simulates the real product UI).
- **Section numbering**: `01 — Selected work`, `02 — An AI-native PM practice`, `03 — 10+ years in enterprise software`, `04 — About`, `05 — Let's build something worth shipping`. Mono labels + display headings.
- **Crow rows**: Label+content grid using `grid-cols-[90px_1fr]` or `grid-cols-[110px_1fr]` — used in About (education/languages/location) and Contact sections. From Themishka layout patterns.
- **Border-grid metrics**: Metrics container has `border-r border-b border-line`, each cell has `border-t border-l border-line`. Creates shared-border table effect without double borders.
