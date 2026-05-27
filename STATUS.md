# Portfolio Project Status

## Current state
Portfolio site is fully PM-attributed: work cards, career timeline, modal overview, and HowIWork cards all frame outcomes around Michael's specific decisions rather than describing product features. Visual theme is dark teal (#5eead4 accent on black canvas), with inline doc-ref badges connecting decision bullets to their proof artifacts. The site reads to a PM audience as a track record of decisions, not a product brochure.

## Last completed
- 2026-05-27: Session-wrap infrastructure — created `/done` skill and PostToolUse hook in global settings.json; hook injects WRAP_TRIGGER into model context after any `vercel --prod` deploy so STATUS.md is always updated before the session closes.
- 2026-05-27: Initialized memory system — MEMORY.md index + 4 memory files: PM copy voice rules, copy transformation context, Michael's PM profile, and reference to `docs/product-case-studies.md` as the authoritative metrics/customer data source.
- 2026-05-27: PM copy transformation — rewrote work cards, timeline, AmveroModal PM contribution, and HowIWork cards to attribute outcomes to Michael's decisions. Added `Decision` union type with inline doc-ref badges. Fixed doc badge grid alignment, removed all em dashes.
- 2026-05-27: AMVero card 4th decision (credit pricing + ROI Optimizer badge) + Simulation three-module story (Thermal→Mechanical→Thermo-mechanical). ROI Optimizer moved from Simulation CTA to AMVero.
- 2026-05-27: Hero fix — removed Oqton from "Shipped to" (Oqton is the builder, not a customer); removed em dash from tagline.

## In progress
Nothing. Clean state.

## Next up (in order)
Nothing. All current milestones completed.

## Decisions log
- **Session-End Hooks**: Two triggers for session wrap-up: (1) PostToolUse Bash hook detects `vercel --prod` and injects WRAP_TRIGGER context; (2) `/done` skill runs the full checklist (STATUS update + next-session starter + optional deploy). Hook lives in `~/.claude/settings.json` (global); skill lives in `.claude/skills/done/SKILL.md` (project).
- **Memory System Bootstrap**: Created `~/.claude/projects/.../memory/` with MEMORY.md index and 4 typed memory files. All future sessions start with PM copy voice rules, project context, and the authoritative data source pre-loaded.
- **PM Attribution Copy Pattern**: Rewrote metrics with attribution clauses ("achieved by designing X") so each number is causally linked to a Michael decision, not just associated with the product.
- **Decision→Doc Visual Link**: Extended `Decision` type to `string | { text, docLabel?, docUrl? }` — renders an inline `[doc ↗]` badge at bullet end, creating a direct visual connection between a decision and its proof artifact.
- **Simulation Three-Module Story**: Card now names all three modules (Thermal, Mechanical, Thermo-mechanical) in sequence, with the thermo-mechanical as the flagship, surfacing three years of iterative work rather than one outcome.
- **ROI Optimizer Attribution**: Moved from Simulation card CTA to AMVero, linked as 4th decision in the credit-pricing story — its actual context.
- **Custom Follower Z-Index**: Raised z-index to `z-[9999]` and updated desktop interactive hover selectors to include form controls (`INPUT`, `SELECT`, `LABEL`, `TEXTAREA`) ensuring correct tracking and visibility inside modals.
- **Custom Follower Cursor**: Implemented client-side event delegation on `mousemove` to scale/glow the custom gold cursor when hovering interactive elements, maintaining standard cursor visibility on touch devices.
- **Modals and Calculators Reskin**: Fully skinned both the interactive `AmveroPrototype` fleet console and `RoiCalculator` in the dark gold theme, ensuring the user experience stays unified inside modals.
- **Separate /site-build Route**: Extracted the "How this site was built" pipeline diagram to a standalone route `/site-build` to prevent layout clutter and resolve 404 targets.
- **Next.js Image Optimization**: Transitioned the profile photo to Next.js `<Image>` with priority loading and explicit `144x144` layout targets, allowing the framework to optimize source JPEGs and eliminate downsampling pixelation on Retina screens.
- **Removed Unverified Metrics**: Deleted the "10x design feedback loops" metric from `SelectedWork.tsx` and `SimulationModal.tsx` to keep portfolio data strictly aligned with the official `DRIVE-DATA.md` records.
- **AI Practice Copy Alignment**: Refined Figma, specs, and Hermes cards in `HowIWork.tsx` to state product management value outcomes (customer feedback loops, unambiguous specs, context-based intelligence) instead of mechanical features.
- **Glassmorphic Outcomes Cards**: Elevated metrics into individual shadow cards with scale-up hover animations to make key business results visually distinct.
- **Clickable Document Badges**: Styled PRDs, whitepapers, and optimization decks as solid, color-coordinated pill badges to make primary proof of PM work look tangible.
- **Nested Sidebar Hierarchy**: Grouped career roles under a parent "Experience" index, adjusting styling (indentation, mixed-case lettering, and smaller track-centered indicator dots) to clarify the visual tree.
- **PM Value-Driven Rephrasing**: Focused the AI operations copy on direct value drivers (e.g. alignment speed, comprehensive backlog analysis, competitive intelligence) rather than technical mechanics.
- **Recruiter-Friendly Build Terms**: Replaced internal agent names (like Antigravity) with industry-standard PM workflow stages (Requirements Definition, Resource Allocation, Quality Guardrails, Release Verification) to explain the portfolio creation process clearly.
- **Claude Code vs. Antigravity Separation**: Defined Claude Code as the PM-driven workflow documentation sync tool in the career timeline, reserving the Google Antigravity harness description purely for the website build section.
- **First-Person/Visual Alignment**: Formatted all text on the site from the first-person perspective (avoiding third-person references to Michael) and linked the Knauf first-time-right assembly validation image in both the timeline card and case study modal to reinforce physical accuracy claims.
- **Product-Oriented Positioning**: Framed the hero tagline around lifecycle ownership ("owning the end-to-end process"), execution scope ("building complex products from scratch"), and database capabilities ("transform complex data into insights") to showcase core PM value over specific technical sectors.
- **Simplified Contact Heading**: Changed the card title to a large "Get in Touch" and removed the redundant "Let's discuss product strategy" to prevent confusion and highlight direct resume/portfolio targets.
- **Scrollspy Hysteresis for Header**: Setting the compacting trigger at `scrollY > 100` and expanding trigger at `scrollY < 30` eliminated layout-reflow feedback loops that caused flickering on the threshold boundaries.
- **Side-by-side Widescreen Modal Grid**: Arranged the AMVero modal as a 12-column grid (`lg:col-span-3` overview, `lg:col-span-9` prototype) to let recruiters explore the interactive dashboard immediately with context visible alongside it, removing redundant clicks.
- **PM-Centric AI Operations Nodes**: Replaced developers-oriented specs with 4 PM operational processes (Figma wireframes, Claude Code spec refinement, Hermes market intelligence, and self-service Support RAG) to accurately detail Michael's product execution model.
- **Product-Level Document Promotion**: Anchored PRD, whitepaper, and optimization documents directly to the career timeline cards so recruiters can review project credentials without opening modals.
- **Vertical Navigation Index**: Placed the scrollspy index on the left screen margin, tracking sections with an IntersectionObserver configured with an offset viewport margin to keep indicator highlighting aligned with user focus.


## Next session starter

```
This is Michael's PM portfolio site (Next.js + Tailwind, dark teal theme, deployed to Vercel dev project).
The site is a senior PM showcase targeting hiring managers — every metric, card, and timeline entry is
framed around Michael's specific decisions and their outcomes, not product descriptions.

What was done last session (2026-05-27):
- Full PM copy transformation: work cards, timeline, modal, HowIWork all rewritten to decision→outcome attribution
- Session-wrap infrastructure: /done skill + PostToolUse vercel hook now auto-triggers STATUS.md updates
- Memory system initialized: 4 memory files in ~/.claude/projects/.../memory/ with copy rules, profile, data source

Key files:
- app/components/SelectedWork.tsx — main work cards (AMVero + Simulation), Decision union type with inline doc badges
- app/components/AmveroModal.tsx — case study modal, PM contribution section
- docs/product-case-studies.md — authoritative source for ALL metrics and customer names (read before editing copy)
- ~/.claude/projects/.../memory/MEMORY.md — memory index (load at session start)

Constraints to carry forward:
- NEVER deploy to /home/michaek/ClaudeCode-portfolio (official site) — only this dev repo
- No em dashes anywhere in copy
- Oqton is the employer/builder, never a customer in "Shipped to" lists
- Before any UI/copy change: invoke portfolio-design-system and portfolio-copy-voice skills
- Before referencing customer names or metrics: invoke ip-handling skill

Nothing is actively in progress. Next work is open — await Michael's direction.
```
