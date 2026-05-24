# Portfolio Site Brief

## Purpose

A personal portfolio site for Michael Korenevsky, Senior Product Manager at Oqton. Shared with recruiters and hiring managers during job applications. The site proves Michael ships real AI products at enterprise scale.

This document is the source of truth for **content, structure, and architecture**. The TypeUI Bento SKILL.md (pulled via `npx typeui.sh pull bento`) governs **base visual patterns**. The four custom skills in `.claude/skills/` enforce voice, IP handling, content sourcing, and deployment.

Read all of these before starting work.

## The ultimate goal: proof-density without scrolling

The site is not a scrolling marketing page. It is a **single-view grid** where a recruiter sees the full structure in 5 seconds and drills into pieces of interest through **expand-in-place** interactions.

A recruiter lands on this site. Within 5 seconds they should see:

- Who Michael is and what he does (top of the grid)
- Six tiles representing his complete story (products, practice, background, contact)
- The most important metrics already visible inside tiles, no expansion needed

A recruiter clicks a tile to expand it inline. The tile grows in place, other tiles fade or shrink, and the expanded content appears beneath the tile title. Clicking the tile again (or any other tile) collapses it. No modal overlay. No scroll position lost. No friction.

This pattern serves three beliefs the site must install:

1. **Michael ships real AI products at enterprise scale.** Proof: AMVero outcomes, named enterprise customers, specific metrics visible inside the AMVero tile.
2. **Michael has range.** Proof: physics-based simulation work alongside AI work, visible in two distinct product tiles.
3. **Michael's PM practice is AI-native.** Proof: the practice tile shows the multi-agent workflow, and the site itself is built using project-specific skills.

## Positioning

The anchor sentence appears in a dedicated tile (small, top-left of the grid):

> Building enterprise AI and predictive tools for high-stakes industries.

Michael Korenevsky, Senior Product Manager. The name and role appear in the site header above the grid, in confident type.

## Audience

Recruiters and hiring managers at B2B enterprise software companies, with bias toward AI-native and agentic AI PM roles. They will spend 30 to 90 seconds. The grid pattern is built around that window.

Two critical constraints:

1. **Enterprise, not SaaS.** The products are enterprise software with on-premise and cloud deployment. Never call them SaaS.
2. **AI vs. physics distinction.** The anomaly detection product is AI-powered (computer vision underneath, described as "AI"). Simulation is physics-based, not AI. Never blur this line.

See `portfolio-copy-voice` and `ip-handling` skills.

## Architecture: grid + expand-in-place

### Layout principles

- Single view, no full-page scroll on the landing state
- Grid fills the viewport on desktop, stacks vertically on mobile
- Each tile is an entry point with key preview content already visible
- Click a tile → it expands in place with full content; other tiles dim or shrink
- Click again (or another tile) → collapses smoothly
- No modal overlays, no separate pages, no URL changes per tile

### Grid composition (desktop)

A 12-column grid. Roughly arranged as follows on desktop, conceptually:

```
[ POSITIONING (small) ] [ HEADER NAME + ROLE (right side) ]

[ AMVERO (large, 2 cols × 2 rows) ]   [ SIMULATION (large, 2 cols × 2 rows) ]

[ PRACTICE (medium) ] [ BACKGROUND (medium) ] [ CONTACT (medium) ]
```

The two product tiles dominate (largest). Practice, Background, Contact share equal medium weight below. Positioning and header sit above the tiles as the orienting band.

On mobile, all tiles stack vertically in order: header, positioning, AMVero, Simulation, Practice, Background, Contact.

### Tile structure (shared pattern)

Every tile has the same internal structure:

1. **Category label** (mono or small caps): e.g., "FLAGSHIP PRODUCT"
2. **Tile title**: a value-prop statement (not a feature description)
3. **Preview content**: 1-3 key metrics, a visual hint, or a short claim already visible without expansion
4. **Expand affordance**: a subtle "Expand" or "+" indicator in a consistent location

When expanded, the tile reveals full content beneath the title. Preview content gets repositioned or absorbed into the expanded view.

## Tiles in detail

### Tile: Positioning (small, top)

**Static content (no expansion):**

The anchor sentence as a quote-style callout:

> Building enterprise AI and predictive tools for high-stakes industries.

That's all. No metrics, no expansion. Functions as the site's thesis.

### Tile: AMVero (large)

**Category label:** "FLAGSHIP PRODUCT"

**Tile title:** "See production failures as they happen."

**Preview content visible without expansion (3-4 key metrics):**
- `5` enterprise customers in 5 months
- `98%` monitoring time reduction
- `18%` scrap cost reduction
- `~50%` machine time recovery

**Expanded content:**

1. **The problem** (1 paragraph)
   Regulated industries run expensive production processes with no real-time visibility into failure. Manual monitoring is labor-intensive. Late detection means scrap. Translate any domain-specific terminology to enterprise-generalist language (see `portfolio-copy-voice`).

2. **The product** (1 paragraph + visual)
   "An AI-powered real-time anomaly detection product for industrial operations." Include one scrubbed product visual pulled from Figma MCP and scrubbed per `ip-handling`.

3. **My role** (mono-labeled "MY SCOPE")
   Full PM ownership across AI output logic, UX/UI design, and direct customer prototype validation. Specific. First person.

4. **The outcomes** (expanded metric panel)
   Same four metrics expanded with context:
   - 5 enterprise customers within 5 months of launch: Baker Hughes, Thales, 3D Systems, Elos Medtech, Beehive
   - 98% reduction in active monitoring time (Baker Hughes deployment)
   - 98% faster root cause analysis
   - 18% scrap cost reduction
   - ~50% machine time recovery per rejected part

5. **How I worked on it** (2-3 sentences)
   Customer prototype validation cycle. Working with AI engineers on output logic. Designing UX for non-technical operators in regulated environments.

### Tile: Simulation (large)

**Category label:** "FLAGSHIP PRODUCT"

**Tile title:** "First time right. No trial and error."

This is the value-prop framing for physics-based predictive simulation. Eliminates iteration on physical hardware. That's the language recruiters understand instantly.

**Preview content visible without expansion:**

A single short line under the title: "Predictive simulation that catches operational failures before production." Optional one metric visible if Drive MCP has pulled accuracy data: `XX%` accuracy improvement.

**Expanded content:**

1. **The problem** (1 paragraph)
   Operational failures caught after they happen are expensive. Trial-and-error iteration on physical hardware burns money and time. Catching failures in simulation before production saves both.

2. **The product** (1 paragraph + visual)
   "A physics-based predictive simulation product for industrial operations." Never described as AI. Visual is a scrubbed simulation output (deformation map, stress visualization, or similar) pulled from Figma MCP and scrubbed.

3. **My role**
   Senior PM, full ownership. Same depth of scope as AMVero.

4. **The outcomes** (metric panel)
   Accuracy improvements pulled from Drive-sourced papers via Drive MCP. Until pulled, use a placeholder: "Accuracy improvement data pulled from validation studies (loading from Drive)."

5. **How I worked on it** (2-3 sentences)
   PM process specifics.

### Tile: Practice (medium)

**Category label:** "PRACTICE"

**Tile title:** "PM work, rebuilt for AI."

**Preview content:**

A visual hint of the workflow stack: four small node labels visible (Harness, Skills, Knowledge, Output) without the full diagram.

**Expanded content:**

1. **The diagram** (centerpiece)
   A clean visual showing four components and how they connect:
   - **Harness**: Claude Code (primary), evaluated against OpenCode for routing flexibility
   - **Skills**: Project-specific skills layered into the harness. The site itself uses five custom skills.
   - **Knowledge base**: Shared product context with live Jira integration
   - **Local agent stack**: Backed by OpenAI and NVIDIA
   
   Below the components, a horizontal flow: `prompt → skills + context → synthesis → output (PRD / spec / prototype)`.
   
   Hover-to-reveal node details is welcome here. This is the one place interactive motion adds value.

2. **What this changes** (paragraph + 3-4 short bullets)
   Faster discovery cycles. Specs that compile against real product knowledge. Prototypes generated from PRDs.

3. **Why it matters for the role I want** (1 paragraph)
   PMs who use AI tools as accessories vs. PMs who have rebuilt their practice around AI. Michael is the second.

### Tile: Background (medium)

**Category label:** "CAREER"

**Tile title:** "Ten years in industrial software."

**Important framing rule:** Do not lead with QA. QA is past, not story. The narrative is AI product leadership built on engineering instincts. QA years appear but compressed.

**Preview content:**

A compact horizontal year-band visible without expansion: "2014–2026 · Cimatron · 3D Systems · Oqton".

**Expanded content:**

A horizontal mini-timeline with visual emphasis on PM/PO years:

```
2014–2017       2017–2020      2020–2022       2022–2024         2024–present
Cimatron        3D Systems     Oqton           Oqton             Oqton
QA Engineer     QA Engineer    QA Manager      Product Owner     Senior PM
                                               PRODUCT WORK      PRODUCT WORK
```

The product roles (Product Owner, Senior PM) are visually emphasized: larger type, accent color, or bolder weight. The QA years are visually quieter: smaller, lower contrast, present as context not story.

One framing sentence below: "Ten years in industrial software. The last four building products."

No bullet points per role. No paragraph per company.

### Tile: Contact (medium)

**Category label:** "CONTACT"

**Tile title:** "Get in touch."

**Preview content:**

Email and LinkedIn links visible without expansion. Functions as a direct entry point.

**Expanded content:**

A short, direct expansion:
- Email (mailto link)
- LinkedIn URL
- Optional GitHub URL
- One line: "Currently exploring Senior PM roles in AI-native enterprise products."
- Professional headshot in a contained frame, subtle border

No contact form. No "let's chat" filler.

## Visual system

TypeUI **Bento** governs base patterns: card structure, grid, typography defaults, spacing. Pulled via `npx typeui.sh pull bento`.

**Overrides to Bento's defaults. Apply as a custom adapter on top of Bento:**

### Palette

The site is light-surface with **four professional gradient tiles** for the product, practice, and background tiles. The positioning and contact tiles use light surfaces with subtle borders for visual rest.

| Token | Value | Used on |
|---|---|---|
| `--bg-base` | `#FAFAF8` (Bento default cream) | Site background |
| `--surface-light` | `#FFFFFF` | Positioning tile, Contact tile |
| `--border-subtle` | `#E5E5E0` | Light tile borders |
| `--gradient-amvero` | `linear-gradient(135deg, #1E293B 0%, #312E81 100%)` | AMVero tile |
| `--gradient-simulation` | `linear-gradient(135deg, #475569 0%, #1F2937 100%)` | Simulation tile |
| `--gradient-practice` | `linear-gradient(135deg, #064E3B 0%, #134E4A 100%)` | Practice tile |
| `--gradient-background` | `linear-gradient(135deg, #404040 0%, #1C1C1C 100%)` | Background tile |
| `--text-on-gradient` | `#F5F5F4` | Primary text on gradient tiles |
| `--text-on-gradient-muted` | `#D4D4D8` | Secondary text on gradient tiles |
| `--text-on-light` | `#0A0A0A` | Primary text on light tiles |
| `--text-on-light-muted` | `#52525B` | Secondary text on light tiles |
| `--accent` | `#F59E0B` | Active states, expand indicators, expanded tile borders |

Reasoning: the four gradients sit in the professional/technical register, share enough tonal weight to read as cohesive, and are distinct enough that the eye can parse the grid structure quickly. The light tiles between gradients provide visual rest.

### Typography

Keep Bento's font choices. Apply these size/weight overrides for the grid context:

- **Site header (name)**: large, confident sans, bold. Visible at the top.
- **Site header (role)**: smaller below name, regular weight, muted.
- **Top nav items**: at least body-large size, not the small caps Bento defaults to. Recruiters need to see them.
- **Tile title**: card-heading size minimum. Bold. On gradient tiles, use `--text-on-gradient`. On light tiles, use `--text-on-light`.
- **Tile category label**: mono or small-caps, accent color or muted-on-gradient. Small but legible.
- **Tile preview metrics**: large display numbers (use Bento's display sans). Numbers on gradient tiles in accent amber for visual punch, labels in muted-on-gradient.

### Spacing and interaction

- Gap between tiles: generous but not excessive. Bento's default likely correct.
- Tile expansion animation: 300-400ms ease, transform-based for performance.
- On expansion: other tiles dim to 50% opacity. Expanded tile gets a subtle accent border.
- On collapse: smooth reverse. No flash, no jank.

### What to avoid

- Bento's default warm pastel pinks, peaches, soft purples (replaced by the gradients above)
- Em dashes anywhere
- Counting-up number animations
- Decorative SVG flourishes inside tiles
- More than one tile expanded at a time (always collapse the previous one)
- Modal overlays (we explicitly chose expand-in-place over modals)

## Build target

Next.js 14+ (App Router), TypeScript, Tailwind CSS, deployed to Vercel free tier. Static export. No backend. Lighthouse 95+ across all metrics.

The expand-in-place pattern is implemented with React state and CSS Grid layout transitions. No modal library needed. Framer Motion is acceptable for the expansion animation if Tailwind transitions are insufficient.

## MCP setup

Two MCP servers required before AMVero and Simulation tiles can be completed. See `README.md`:

1. **Google Drive MCP** for Simulation accuracy data
2. **Figma MCP (Dev Mode)** for product visual references

## Build sequence

1. Run `npx typeui.sh pull bento`.
2. Read all skills: Bento (visual base), then the four in `.claude/skills/`.
3. Read this BRIEF.md end to end.
4. Confirm MCP servers connected. If not, ask before continuing.
5. Scaffold a new Next.js project. Delete any previous portfolio code from earlier iterations.
6. Build the grid layout with all six tiles in *collapsed/preview state only*. Apply the gradient palette overrides. Show to user before adding expansion logic.
7. Add the expand-in-place interaction for one tile (start with AMVero). Show to user.
8. Once expansion pattern is confirmed working, replicate for the other tiles.
9. Pull AMVero visuals via Figma MCP, scrub per `ip-handling`, embed in expanded view.
10. Pull Simulation accuracy data via Drive MCP, embed in expanded view.
11. Performance pass.
12. Deploy to Vercel.

## Out of scope for v1

- Modal overlays (explicitly chose expand-in-place instead)
- Dark mode (light surface with gradient tiles is the system)
- Hebrew version
- Blog or articles
- Chatbot or AI Q&A
- Form submissions, analytics beyond Vercel defaults
- Custom domain (can be added later)
- Multiple tiles expanded simultaneously
