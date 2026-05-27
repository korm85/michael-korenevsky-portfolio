# AMVero PM Artifacts Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three PM-craft proof points to the AMVero work card — a PRD pull quote, an attributed article badge, and two new value-labeled doc badges — without changing any other part of the site.

**Architecture:** All changes are in a single component (`SelectedWork.tsx`). The `WorkCard` component receives a `docs` prop array and a new optional `prdQuote` prop. The AMVero card instance gets updated doc labels and the new quote prop. No new files, no new components.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4

---

## File Map

| File | Action | What changes |
|---|---|---|
| `app/components/SelectedWork.tsx` | Modify | Add `prdQuote` prop to `WorkCard`, render pull quote block, update doc badge labels, add two new badges |

---

### Task 1: Add `prdQuote` prop and render the pull quote block

**Files:**
- Modify: `app/components/SelectedWork.tsx`

This adds an optional `prdQuote` prop to `WorkCard` that renders a styled pull quote between the customer line and the CTA button. If not passed, nothing renders (Simulation card is unaffected).

- [ ] **Step 1: Add the prop type**

In `SelectedWork.tsx`, find the `WorkCardProps` interface (around line 13) and add the new optional field:

```typescript
interface WorkCardProps {
  eyebrow: string;
  roleTag: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  metrics: { value: string; label: string }[];
  customerLine: string;
  ctaLabel: string;
  ctaSubtitle: string;
  onCta: () => void;
  docs: Doc[];
  quote?: Quote;
  prdQuote?: { text: string; linkLabel: string; linkUrl: string }; // ← add this
}
```

- [ ] **Step 2: Render the pull quote in WorkCard**

In the `WorkCard` function body, find the customer line `<p>` (the line that renders `customerLine`) and insert the pull quote block immediately after it, before the CTA button:

```tsx
<p className="text-xs text-[#71717a]/60 mb-4">
  <span className="text-[#71717a]">Customers:</span> {customerLine}
</p>

{/* PRD pull quote — only renders when prdQuote prop is passed */}
{prdQuote && (
  <div className="border-l-2 border-teal-accent/30 bg-teal-accent/[0.03] rounded-r px-3 py-2 mb-4">
    <p className="text-xs italic text-white/60 leading-relaxed">
      &ldquo;{prdQuote.text}&rdquo;
    </p>
    <a
      href={prdQuote.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[9px] font-mono uppercase tracking-widest text-teal-accent/50 hover:text-teal-accent/80 transition-colors mt-1 inline-block"
    >
      {prdQuote.linkLabel} ↗
    </a>
  </div>
)}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/michaek/ClaudeCode-portfolio-dev && npm run build 2>&1 | grep -E "error|warning|✓"
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```bash
git add app/components/SelectedWork.tsx
git commit -m "feat: add prdQuote prop to WorkCard for PM craft pull quote"
```

---

### Task 2: Pass the pull quote to the AMVero card instance

**Files:**
- Modify: `app/components/SelectedWork.tsx`

Wire the `prdQuote` prop into the AMVero `WorkCard` call. The Simulation card gets no `prdQuote` prop — it renders nothing.

- [ ] **Step 1: Add `prdQuote` to the AMVero WorkCard call**

Find the first `<WorkCard` instance (the AMVero one — eyebrow `"AI Platform"`). Add the `prdQuote` prop:

```tsx
<WorkCard
  eyebrow="AI Platform"
  roleTag="Senior PM, AI Platform · Oqton · 2025–Present"
  title="Real-time AI quality control for industrial manufacturing"
  description="An AI vision system that watches production in real time and flags errors before they accumulate as scrap. Deployed across aerospace, energy, and medical manufacturing clients."
  image="/amvero-product.png"
  imageAlt="Real-time AI quality control dashboard"
  prdQuote={{
    text: "Operators stop trusting the system and miss the alerts that actually matter — solved with condition-based filtering across multiple layers.",
    linkLabel: "Smart Alerting PRD",
    linkUrl: "https://docs.google.com/document/d/1zoWRqvujh96Wlu9V3eaDodg8C0gYmsjvuJvhB0HCPKo/edit",
  }}
  metrics={[ ... ]}  // leave unchanged
  ...
```

- [ ] **Step 2: Build to verify**

```bash
npm run build 2>&1 | grep -E "error|✓"
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/components/SelectedWork.tsx
git commit -m "feat: wire PRD pull quote into AMVero work card"
```

---

### Task 3: Update doc badges — rename Product Article and add two new badges

**Files:**
- Modify: `app/components/SelectedWork.tsx`

Three doc array changes in the AMVero `WorkCard` call:
1. Rename `"Product Article"` → `"Go-to-Market Narrative"` and append attribution
2. Add `"Enterprise Deployment Playbook"` badge
3. Add `"End-to-End Traceability Record"` badge

- [ ] **Step 1: Update the `Doc` interface to support an optional suffix**

The `Doc` interface currently has `name` and `url`. Add an optional `suffix` field for attribution text:

```typescript
interface Doc {
  name: string;
  url: string;
  suffix?: string; // e.g. "· by Michael"
}
```

- [ ] **Step 2: Render the suffix in the badge**

Find the badge render inside `WorkCard` (the `docs.map(...)` block) and update it to show the suffix when present:

```tsx
{docs.map((doc, i) => (
  <a
    key={i}
    href={doc.url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-xs text-[#71717a] hover:text-[#5eead4] transition-colors border border-[#27272a]/50 rounded px-2.5 py-1"
  >
    {doc.name}
    {doc.suffix && (
      <span className="opacity-50 text-[9px]">{doc.suffix}</span>
    )}
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  </a>
))}
```

- [ ] **Step 3: Update the AMVero docs array**

Replace the current `docs` array in the AMVero `WorkCard` call:

```tsx
docs={[
  {
    name: "Go-to-Market Narrative",
    suffix: "· by Michael",
    url: "https://drive.google.com/file/d/1nlpqP3HfYCE-Y6ngzdWjNLnulv7eqLqx/view",
  },
  {
    name: "Launch Announcement",
    url: "https://drive.google.com/file/d/18rYHWxkrakU_upjXpZjqHeDLN6DSPNOT/view",
  },
  {
    name: "Alerts PRD",
    url: "https://docs.google.com/document/d/1zoWRqvujh96Wlu9V3eaDodg8C0gYmsjvuJvhB0HCPKo/edit",
  },
  {
    name: "ROI Optimizer",
    url: "https://drive.google.com/file/d/1GbkdsS5vJLpCvJQOYmCaMfCiRhDfAl6T/view",
  },
  {
    name: "Enterprise Deployment Playbook",
    url: "https://drive.google.com/file/d/1rEQ7zXss5wW-dNQX4dJPOiB2ol4hi7iC/view",
  },
  {
    name: "End-to-End Traceability Record",
    url: "https://drive.google.com/file/d/1DwbPGyvXXezRL5boYS2eN8NJM6fKVTzT/view",
  },
]}
```

- [ ] **Step 4: Build to verify**

```bash
npm run build 2>&1 | grep -E "error|✓"
```

Expected: `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```bash
git add app/components/SelectedWork.tsx
git commit -m "feat: value-labeled PM artifact badges on AMVero card"
```

---

### Task 4: Deploy to dev Vercel and verify

- [ ] **Step 1: Final build check**

```bash
npm run build 2>&1 | tail -12
```

Expected: all 4 routes static, no errors.

- [ ] **Step 2: Deploy to dev**

```bash
npx vercel --prod --yes 2>&1 | grep -E "Aliased|error"
```

Expected: `▲ Aliased     https://michael-korenevsky-dev.vercel.app`

- [ ] **Step 3: Verify on live URL**

Open `https://michael-korenevsky-dev.vercel.app` and confirm:
- AMVero card shows the teal pull quote block above the CTA
- Badge row shows "Go-to-Market Narrative · by Michael", "Enterprise Deployment Playbook", "End-to-End Traceability Record"
- Simulation card is unchanged
- All badge links open the correct Drive documents

- [ ] **Step 4: Update STATUS.md**

```markdown
## Last completed
- 2026-05-25: Added PM artifact proof points to AMVero card — PRD pull quote, Go-to-Market Narrative attribution, Enterprise Deployment Playbook badge, End-to-End Traceability Record badge
```

---

## Self-Review

**Spec coverage:**
- ✅ Change 1 (PRD pull quote): Tasks 1 + 2
- ✅ Change 2 (article attribution): Task 3
- ✅ Change 3 (two new badges): Task 3
- ✅ Deploy and verify: Task 4

**Placeholder scan:** No TBDs, TODOs, or vague steps. All code shown in full.

**Type consistency:** `prdQuote` prop defined in Task 1 and consumed in Task 2. `Doc.suffix` defined in Task 3 Step 1 and rendered in Task 3 Step 2. No mismatches.
