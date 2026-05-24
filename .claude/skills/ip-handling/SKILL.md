# Skill: IP Handling

Rules for referencing Oqton products, visuals, and proprietary details without exposing confidential information or violating attribution obligations. Apply to every word and image in Sections 2 and 3.

## Core rule

Michael did the PM work. The IP belongs to Oqton. The portfolio shows his judgment, process, and outcomes — not the product internals.

## What can be shown

- Hard outcome metrics (those listed in the BRIEF are pre-approved)
- Problem framing (operational risk, cost-of-quality, manual overhead) — these are industry-generic
- Michael's role and scope ("Senior PM, full ownership of X")
- Process descriptions ("prototype validation with enterprise customers", "defined acceptance criteria for AI output logic")
- Scrubbed or abstracted UI screenshots (see visual rules below)
- The product category ("AI-powered anomaly detection", "physics-based predictive simulation")

## What cannot be shown

- Product names (AMVero, Simulation Suite) — use functional descriptions only
- Oqton internal architecture, ML model details, or algorithm specifics
- Computer vision technique (do not name "computer vision" — say "AI-powered")
- Customer names — use "enterprise customers" or industry vertical if appropriate
- Revenue figures, contract values, or internal roadmap items
- Verbatim screenshots without scrubbing

## Functional descriptions (use these)

| Internal name | Public-safe description |
|---|---|
| AMVero | "AI-powered real-time anomaly detection product" |
| Simulation Suite | "physics-based predictive simulation product" |
| Computer vision model | "AI" or "machine learning model" — no technique name |
| Specific customer names | "enterprise customer" or "a regulated manufacturer" |

## Visual scrubbing rules for screenshots

If Michael provides product screenshots:
1. Blur or mask any customer data, job names, part numbers, or file names visible in the UI
2. Crop to the relevant UI region — do not show full-application chrome that reveals product architecture
3. Use a dark overlay at reduced opacity if the raw screenshot would reveal too much structure
4. Add a caption: "Product UI — details obscured" if the scrubbing is visible
5. Never use Figma design files as "screenshots" of the live product — they may contain unreleased or internal specs

## Oqton attribution

- It is fine to say Michael worked at Oqton and built these products
- Do not imply sole invention — he was the PM; engineering, design, and data science teams built the product
- Correct framing: "led product development of...", "owned the roadmap for...", "defined requirements and drove delivery of..."
- Incorrect: "built", "created", "invented", "designed" (without qualifying as PM work)

## Physics-based vs AI — do not blur this line

One product is AI-powered (anomaly detection). One product is physics-based (simulation). These are distinct technical approaches. The two-product story is evidence of range precisely because they are different. Do not describe the simulation product as "AI" — it is not. Do not describe the anomaly detection product as "physics-based."

## Metrics pre-approved for use (Section 2 — Anomaly Detection)

- 5 enterprise customers in 5 months
- 98% reduction in active monitoring time
- 98% faster root cause analysis
- 18% scrap cost reduction
- ~50% machine time recovery per rejected part

These numbers may be used as published. Do not add precision that is not in the BRIEF (e.g., do not change "~50%" to "52%").

## Metrics for Section 3 (Simulation)

Accuracy improvement numbers must be pulled from the Drive folder via the `portfolio-content-from-drive` skill. Do not fabricate or estimate. If Drive MCP is unavailable, use a clearly marked placeholder: `[METRIC — PENDING DRIVE PULL]`.
