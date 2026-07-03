# Portfolio Project Status

## Current state

Full visual redesign complete and live on `themishka.me`. Dark/cream/forest-green palette (Themishka-inspired), Fraunces display serif, Hanken Grotesk body. Long-scroll layout with alternating dark/cream sections. All modals, overlays, and mobile layouts are production-ready. Site deployed from `github.com/korm85/michael-korenevsky-portfolio` via Vercel GitHub integration.

## Last completed

- 2026-06-08: Pushed Themishka redesign to official repo and deployed to `themishka.me`. Replaced Emily Beal gold/bento design entirely.
- 2026-06-08: Added image lightbox (click hero images to expand as overlay). Added RoiOverlay with zoom controls for Credit Pricing Model. Made all doc chips visible at rest (text-ink-soft).
- 2026-06-08: Removed ROI Simulator tab from SimulationModal (was AMVero content misplaced there). Rewrote SimulationModal PM contribution copy with accurate specifics.
- 2026-06-08: Rewrote HowIWork section — four cards with concrete AI-impact framing, first-person, tied to real AMVero and Simulation work. Removed marketing language.
- 2026-06-08: Fixed mobile layout (Tailwind responsive classes replacing inline gridTemplateColumns). Fixed modal dark backgrounds from stale design tokens.

## In progress

Nothing. Clean state.

## Next up

- Review themishka.me on real mobile device after DNS propagation
- Consider adding Credit Pricing Model as a tab inside AmveroModal (currently accessible via doc chip and inline decision link only)

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
- **IP on the portfolio is approved (2026-07-03)**: Naming AMVero, Simulation Suite, customers, and attributed quotes is a non-issue per Michael. The `ip-handling` skill carries a superseding status note. Still off-limits: revenue/contract figures, internal architecture, roadmap items.
- **No resume file on the site (2026-07-03)**: Deliberate. Michael tailors resume files per role; a single generic PDF would interfere with role fit. Do not re-add or re-flag.
- **/dashboard removed from production (2026-07-03)**: It rendered internal STATUS.md publicly. Status lives in the repo only.
