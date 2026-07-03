# Portfolio UX & Engineering Audit — 2026-07-03

Scope: full audit of the portfolio site as it exists on `main` (verified against
live production at www.themishka.me — all routes checked live). Every finding is
anchored to a file/line in this repo or a measured value; nothing is invented.

---

## 0. Meta-finding: the site contradicts its own IP policy

The `ip-handling` skill in this repo forbids product names ("AMVero",
"Simulation Suite" — functional descriptions only), forbids customer names
("use enterprise customers"), and explicitly forbids naming "computer vision."
The live site does all three:

- AMVero is named throughout (`SelectedWork.tsx`, `AmveroModal.tsx`, `HowIWork.tsx`, artifacts)
- Hero lists Baker Hughes · Thales · Elos Medtech · 3D Systems · Beehive (`page.tsx:126`)
- Quotes attributed to named individuals: Amar Patel (`SelectedWork.tsx:429`), Francesco Trevisan (`SelectedWork.tsx:463`)
- "real-time computer vision pipelines" verbatim at `AmveroModal.tsx:64`
- ITAR reference at `AmveroModal.tsx:67`

Either approvals were obtained after the skill was written — in which case the
skill must be updated so it stops being wrong — or the site publishes things it
agreed not to publish. This must be resolved before anything cosmetic.

Related staleness: `portfolio-design-system` skill mandates a dark/teal/Geist
system while the shipped site is cream/green/Fraunces/Hanken. Governance docs
that lost to reality should be updated or deleted.

---

## 1. First fold & positioning

**5-second test: passes on role, fails on niche.** Above the fold: status dot +
"Senior Product Manager · Open to roles" (11px), name at up to 9.5rem, the line
"Building enterprise AI and predictive tools for high-stakes industries," two
CTAs, customer list. Role and availability land instantly. But nothing above
the fold says *monitoring*, *inspection*, *manufacturing*, or *B2B industrial* —
"high-stakes industries" is abstraction. Fix is one line of copy, defensible
from existing content: e.g. "AI-powered production monitoring and physics-based
predictive simulation for industrial manufacturers" (`app/page.tsx:87`).

**Hierarchy: the strongest trust signal is the smallest text on screen.** The
"Shipped to" customer list is 10px mono with a 9px label (`page.tsx:122-127`).
Enterprise logos are a recruiter's fastest credibility check; they are nearly
invisible while the name consumes the fold. Bump the customer line to readable
size; consider pulling one hard number ("5 enterprise contracts in 5 months")
into the hero. (Contingent on §0 — if customer names must go, hero proof
strategy becomes metrics-only.)

**Working well:** the "Open to roles" eyebrow and footer "Available" indicator
answer the recruiter's first question without a click.

---

## 2. Friction points & UX debt

Ordered by hiring-loop impact:

1. **Case studies have no URLs.** Both flagship case studies open in modals
   (`AmveroModal`, `SimulationModal`). They cannot be bookmarked or shared with
   a hiring panel, and the modals are not integrated with browser history —
   pressing Back while reading exits the site. For a "friction-free UX" pitch,
   this is the contradiction an interviewer will notice. Promote to routes
   (`/work/amvero`, `/work/simulation`) or at minimum sync modal state to URL.

2. **No resume.** Commit `29b26ed` deliberately removed the resume link; no
   resume file exists in `public/`. A recruiter's terminal action is "download
   resume, attach to ATS" — currently impossible. If it was removed for being
   stale, that argues for updating it, not removing it.

3. **"Portfolio → View portfolio overview" contact link is disorienting**
   (`ContactSection.tsx:14-18`). The user is already on the portfolio.
   `/portfolio` is a condensed duplicate of the homepage with unclear intent —
   label it ("One-page summary · print-friendly") or remove it.

4. **`/dashboard` publicly serves internal STATUS.md** — verified 200 on
   production. Private status notes and decisions log are one URL guess away
   from any hiring manager. Remove from production or gate it.

5. **Smaller:** nav label "Practice" vs section title "How I use AI as a PM"
   (`Header.tsx:7`) — scent mismatch. Doc chips link to PDFs up to 7MB
   (`simulation-thermal-whitepaper.pdf`) with no size/type hint. Image lightbox
   trigger is a `div` with `onClick` (`SelectedWork.tsx:206`) — invisible to
   keyboard users.

---

## 3. Engineering & performance

- **Genuine React bug:** `RoiOverlay` and `ImageOverlay` use `useState(() => {...})`
  where `useEffect` was intended (`SelectedWork.tsx:81-85`, `153-158`). The
  initializer registers a `keydown` listener as a render side effect and returns
  a cleanup function React stores *as state* and never calls. Every open leaks a
  listener; StrictMode double-registers. Two-line fix.
- **Images bypass the optimizer.** Case study images are raw `<img>`:
  `amvero-product.png` 1.19MB, `simulation-knauf-fit.png` 617KB, no srcset, no
  AVIF/WebP, no lazy loading. Modal loads `simulation-product.png` (2.2MB) and
  `simulation-heatmap.png` (928KB) the same way. The one `next/image` usage (About
  photo, `page.tsx:167`) has `priority` set despite sitting four sections below
  the fold — preloading 316KB against real above-fold content. Converting to
  `next/image` + re-encoding is the biggest load-time win available.
- **Contrast failures (computed):** `--color-ink-faint` #8b8478 on paper #f3efe6
  ≈ 3.2:1; `--color-on-dark-faint` #75705f on #1b1916 ≈ 3.5:1 — both below the
  4.5:1 WCAG AA threshold and both used for small text (9px metric labels,
  timeline body). Accent green #16a34a on cream ≈ 2.9:1, failing even the 3:1
  large-text threshold — and it is the color of the metric numbers. 9–10px
  uppercase tracked mono is pervasive; hostile on mobile.
- **Modal accessibility:** no `role="dialog"`/`aria-modal`, no focus trap, no
  focus return, no body scroll lock. Escape works; nothing else does. Mobile
  menu button lacks `aria-expanded`.
- **Bundle:** entire homepage is one `"use client"` tree; `AmveroPrototype`
  (553 lines) and both modals are statically imported despite starting closed —
  use `next/dynamic`. Hover lifts done via inline `onMouseEnter` style mutation
  (`page.tsx:100-101`) instead of CSS `:hover`.
- **Metadata gaps:** no Open Graph / Twitter card tags (verified absent on live
  HTML). LinkedIn shares — the primary recruiter channel — render as a bare
  link. Highest ROI-per-minute fix in this audit. No sitemap/robots; consider
  JSON-LD `Person` schema.
- **Motion:** no `prefers-reduced-motion` handling (smooth scroll, infinite
  `animate-ping`, reveal animations all unconditional).
- **Repo litter shipped publicly:** `public/` contains a Windows
  `Zone.Identifier` artifact, template leftovers (`next.svg`, `vercel.svg`,
  `globe.svg`), and orphaned hash-named PNGs.

---

## 4. Case study & proof architecture

**Working — above the median PM portfolio:** outcome-led titles, decisions
framed as trade-offs with rationale, metrics tied to a named deployment, and an
artifact library (PRD, GTM narrative, deployment playbook, traceability record)
that is real proof-of-work. Linking the Alerts PRD from the decision it
implements is excellent. The physics-vs-AI distinction is handled correctly.
The QA→PM narrative gives it a defensible spine.

**Interview vulnerabilities:**

- **"90% model accuracy" (`AmveroModal.tsx:105`) appears nowhere in the source
  data** — not in BRIEF's pre-approved metrics, not in DRIVE-DATA.md. Accuracy
  of what, precision or recall, on what set? If unanswerable in one breath, cut it.
- **"99%+ dimensional accuracy" is rephrase drift.** Source says "compensates
  for close to 100% of dimensional distortion" — a different claim. Use the
  source framing.
- **Attribution blur:** the 80% / <150µm numbers come from the Emerson story in
  DRIVE-DATA.md, but the article's customer line says "Knauf and tooling
  manufacturers." Attribution is precise on AMVero, loose here.
- **Metrics lack baselines.** "136h saved per printer per year" — vs what
  workflow? One clause of context doubles defensibility.
- **As-built record story is buried.** The end-to-end traceability artifact +
  "logs all sensor data, imagery, anomalies" capability *is* the as-built story;
  it is currently the last doc chip. Surface it as a named capability. Do not
  adopt "digital twin" as a label unless the term was used internally.

---

## 5. Prioritized action plan

| # | Element/Issue | Suggested Improvement | Business/UX Value | Effort |
|---|---|---|---|---|
| 1 | IP policy conflict (product/customer names, "computer vision", ITAR) | Approvals exist → update skill; otherwise scrub content | Legal/professional risk; interview defensibility | Low (decision) – Med (scrub) |
| 2 | `/dashboard` serves internal STATUS.md publicly | Remove from production build or gate | Stops internal notes leaking | Low |
| 3 | Case studies trapped in modals; Back exits site | Promote to routes or URL-synced modal state | Shareable proof; fixes worst UX contradiction | Med |
| 4 | No Open Graph / Twitter meta | Add OG tags + social image in `layout.tsx` | LinkedIn share card — primary channel | Low |
| 5 | No resume | Add current PDF resume link in contact + nav | Enables recruiter's terminal action | Low |
| 6 | Hero: vague niche line; 10px customer list | Sharpen subline; enlarge customer proof | Passes 5-second niche test | Low |
| 7 | "90% model accuracy" unsourced; "99%+" drift | Cut or define per DRIVE-DATA.md | Removes interview landmines | Low |
| 8 | 1.2–2.2MB PNGs, raw `<img>`, misplaced `priority` | `next/image` throughout; AVIF/WebP | Mobile load; engineering credibility | Med |
| 9 | Contrast failures (~3.2:1 faint, ~2.9:1 accent) + 9px labels | Darken tones; floor labels at 11px | Legible metrics; WCAG AA | Low–Med |
| 10 | `useState`-as-`useEffect` bug; modal a11y; lightbox keyboard access | Fix hooks; dialog semantics + focus management; button lightbox | Correctness + a11y credibility | Med |
| 11 | Modals/prototype in initial bundle | `next/dynamic` for both modals | Smaller first load | Low |
| 12 | "Portfolio overview" confusion; "Practice" label mismatch | Label `/portfolio` as printable one-pager or remove; rename nav | Removes contact-moment disorientation | Low |
| 13 | No `prefers-reduced-motion`; `public/` litter; stale design-system skill | Add media query; delete artifacts; update/retire skill | Polish + honest internal docs | Low |

**Summary:** the proof architecture is genuinely strong — outcome-led case
studies with real artifacts — but it is undermined by an unresolved IP-policy
contradiction, unlinkable case studies, a missing resume, and engineering
details (leaked listeners, megabyte PNGs, failing contrast) that a technical
hiring panel evaluating a "friction-free products" claim is exactly the
audience to notice. Items 1–7 are low-effort except the routes work; together
they change what a recruiter can do in their first two minutes on the site.
