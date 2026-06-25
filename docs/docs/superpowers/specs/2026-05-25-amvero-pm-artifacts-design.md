# AMVero PM Artifacts Enhancement — Design Spec

**Date:** 2026-05-25  
**Author:** Michael Korenevsky  
**Status:** Approved for implementation

---

## Goal

Surface proof of PM craft directly inside the existing AMVero work card — without adding new sections, new pages, or new interaction patterns. A recruiter reading the card should encounter one sentence of PM thinking and three value-labeled links to real artifacts, without having to click anything first.

## Audience signal

Recruiters at AI-native enterprise software companies who scan for evidence that a PM owns the full product lifecycle — not just shipping features. The three artifacts together cover three lifecycle stages:

- **Pre-launch** — authored the product's public go-to-market narrative
- **Post-launch** — built the deployment playbook for enterprise on-premises customers
- **In production** — the product generates regulatory-grade traceability records in real customer environments

## What changes

**File:** `app/components/SelectedWork.tsx` — AMVero `WorkCard` instance only.

No new components. No new sections. No changes to the Simulation card, HowIWork, CareerTimeline, or any other part of the page.

---

## Change 1 — PRD pull quote

**Location:** Left column, between the customer line and the CTA button.

**Content:**
> *"Operators stop trusting the system and miss the alerts that actually matter — solved with condition-based filtering across multiple layers."*
> — Smart Alerting PRD ↗

**Link:** `https://docs.google.com/document/d/1zoWRqvujh96Wlu9V3eaDodg8C0gYmsjvuJvhB0HCPKo/edit`

**Styling:**
- Left border: `border-l-2 border-teal-accent/30`
- Background: `bg-teal-accent/[0.03]`
- Text: `text-xs italic text-white/60 leading-relaxed`
- Attribution line: `text-[9px] font-mono uppercase tracking-widest text-teal-accent/50 mt-1`
- Wrapper: `rounded-r px-3 py-2 mb-4`

**Why this placement:** Sits between context (what it is, who uses it) and the CTA — the recruiter reads the problem framing before being invited to explore the prototype.

---

## Change 2 — Renamed and attributed Product Article badge

**Current label:** `Product Article`  
**New label:** `Go-to-Market Narrative`  
**Attribution suffix:** `· by Michael` (appended in muted text after the label)

**Link:** unchanged — `https://drive.google.com/file/d/1nlpqP3HfYCE-Y6ngzdWjNLnulv7eqLqx/view`

**Styling:** Same badge style as existing doc badges, attribution suffix at `opacity-50 text-[9px]`.

---

## Change 3 — Two new doc badges

Added to the existing badge row in the right column, after the existing badges.

| Label | Descriptor | Drive link |
|---|---|---|
| Enterprise Deployment Playbook | (no tooltip needed — label is self-explanatory) | `https://drive.google.com/file/d/1rEQ7zXss5wW-dNQX4dJPOiB2ol4hi7iC/view` |
| End-to-End Traceability Record | (no tooltip needed) | `https://drive.google.com/file/d/1DwbPGyvXXezRL5boYS2eN8NJM6fKVTzT/view` |

**Styling:** Identical to existing badge style — `text-[#71717a] hover:text-[#5eead4] border border-[#27272a]/50 rounded px-2.5 py-1 text-xs`.

---

## What does NOT change

- Card layout, grid, image, metrics, customer quote block
- Simulation card — no changes
- Any other page section
- Modal components (AmveroModal, SimulationModal)
- Routing, globals.css, layout.tsx

---

## Spec self-review

- No placeholders or TBDs — all Drive links confirmed and accessible
- No contradictions between sections
- Scope is tight: one component, three additions
- All labels reviewed and approved by Michael

---

## Drive links (confirmed readable)

| Document | Drive ID | Public |
|---|---|---|
| Smart Alerting PRD | `1zoWRqvujh96Wlu9V3eaDodg8C0gYmsjvuJvhB0HCPKo` | Confirm before deploy |
| AMVero Product Article | `1nlpqP3HfYCE-Y6ngzdWjNLnulv7eqLqx` | Already linked on site |
| Enterprise Deployment Playbook | `1rEQ7zXss5wW-dNQX4dJPOiB2ol4hi7iC` | Confirm before deploy |
| End-to-End Traceability Record | `1DwbPGyvXXezRL5boYS2eN8NJM6fKVTzT` | Confirm before deploy |
