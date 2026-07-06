# Portfolio Project Status

## Current state

Full visual redesign complete and live on `themishka.me`. Dark/cream/forest-green palette (Themishka-inspired), Fraunces display serif, Hanken Grotesk body. Long-scroll layout with alternating dark/cream sections. All modals, overlays, and mobile layouts are production-ready. Site deployed from `github.com/korm85/michael-korenevsky-portfolio` via Vercel GitHub integration.

## Last completed

- 2026-07-06: Clarity audit + mock/prototype visual upgrade (branch `claude/portfolio-clarity-audit-l2t7id`, PR pending review). Credit Pricing Model rebuilt as a native on-brand React overlay (retired the off-brand CDN-Tailwind iframe tool and its AI-generation meta tags); PM Notes annotation toggle added to AmveroPrototype; all 8 artifact docs rethemed from teal/system-fonts to site green/cream/Fraunces (fonts load async so the doc overlay never blanks); hero bullet 2 rewritten jargon-free; Wärtsilä added to the Simulation customer line; Knauf beta caption added to SimulationModal; deleted orphaned `/site-build`, `SiteArchitecture`, `TimelineNav`; fixed AmveroModal clipping on short screens.
- 2026-07-03: Merged the audit-driven redesign (PR #6, "Variation C") to `main` — now live on `themishka.me`. PM-first hero, bottom "Find Anything" action panel with scrollspy, in-site document overlay (PDFs converted to HTML, replacing new-tab links), AmveroPrototype rethemed to the site palette, WCAG AA contrast, dialog a11y, `/dashboard` and `/portfolio` removed.
- 2026-07-03: Fixed a real race condition where Escape could silently fail to close a doc overlay depending on load speed (the Escape-forwarding listener now attaches immediately instead of waiting on the iframe's `load` event).
- 2026-07-03: Fixed PDF-overlay "needs a second click" bug — root cause was focus never moving into the JS-opened dialog; now focused programmatically on mount.
- 2026-07-03: Converted 3 PDF artifacts (GTM Narrative, Deployment Playbook, Traceability Record) to in-site HTML docs; restored the Traceability Record's 3 embedded images (3D build viewer, two anomaly-marked layer captures) from the original PDF. GTM Narrative's 5 screenshots were intentionally left out (unscrubbed, include a customer job name and a partner's logo) — text-only for now.

## In progress

Nothing. Clean state.

## Next up

- Review the clarity-audit PR on its Vercel preview and merge to `main`
- Decide on PRs #3/#4/#5 (audit doc + the two standalone comparison variations) — now superseded by the merged #6, candidates for closing
- GTM Narrative screenshots: revisit if Michael wants them scrubbed and added later
- Review themishka.me on a real mobile device post-deploy

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
- **PDF artifacts converted to in-site HTML (2026-07-03)**: Browser-native PDF viewers proved unreliable inside a JS-opened overlay (needed a second click, and separately a race condition could break Escape-to-close). Converting to HTML sidesteps both classes of bug entirely and matches the rest of the site's doc-overlay pattern. 5 remaining PDFs with no HTML equivalent were deleted as unreferenced dead weight.
- **GTM Narrative ships text-only, no screenshots (2026-07-03)**: The original PDF's 5 screenshots include an unscrubbed customer job name and a partner company's logo. Per `ip-handling`, unscrubbed screenshots aren't shown as-is; Michael deferred the scrubbing decision rather than approve as-is. Revisit if he wants them added later.
- **Pricing tool is native React, not an iframe (2026-07-06)**: The Credit Pricing Model renders as a `PricingOverlay` + `RoiCalculator` component. A responsive component reflows, so the doc overlay's zoom hook isn't needed, and Escape/focus work through the normal dialog path. The old `/tools/amvero-roi-optimizer.html` (CDN Tailwind, Chart.js, off-brand palette, leftover AI-generation meta tags in source) was deleted along with its unreferenced `/artifacts/roi-optimizer.html` duplicate.
- **Artifact docs load Google Fonts async (2026-07-06)**: A render-blocking fonts `<link>` blanks the doc-overlay iframe until the stylesheet resolves. All 8 artifacts use the `media="print" onload` swap pattern (+ noscript fallback) so content paints immediately with fallback fonts.
- **PM Notes off by default (2026-07-06)**: The AmveroPrototype annotation layer stays hidden so the demo reads as a clean product simulation; the modal intro tells visitors the toggle exists. Availability signal stays in Contact/About only — Michael reconfirmed the hero carries no availability line (2026-07-06).
