# Portfolio Project Status

## Current state
Portfolio site redesigned and transformed into a premium dark gold visual style matching emilybeal.com (black canvas, surface card elements, thin dark borders, and gold accents). Features custom cursor tracking, dual-column timeline structure with year indexes, structured values/background grid, testimonials outcomes metrics, and reskinned interactive modals/calculators.

## Last completed
- 2026-05-24: Fixed custom follower cursor layer bug by raising z-index to z-[9999] so it renders on top of modals, and extended interactive hover states to range sliders, selects, labels, and textareas.
- 2026-05-24: Refactored project cards to horizontal full-width stacked layouts on desktop, widening metric boxes and preventing text wrap clipping.
- 2026-05-24: Reduced hero tagline text size to restore visual balance and prevent it from looking out of place.
- 2026-05-24: Transformed portfolio to Emily Beal visual style (black canvas, surface cards, thin dark borders, gold accent `#b08e4f`, custom following mouse cursor, serif/sans font pairs).
- 2026-05-24: Reskinned AMVero prototype console, ROI savings calculator, and case study modals in unified dark gold themes.

## In progress
Nothing. Clean state.

## Next up (in order)
Nothing. All current milestones completed.

## Decisions log
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

