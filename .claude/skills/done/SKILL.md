# Skill: Session Wrap-up (`/done`)

Use when Michael types `/done` or when a `vercel --prod` deploy is detected. Closes the session cleanly so the next one starts with full context.

## Steps — run in this order

### 1. Update STATUS.md

Read the current `STATUS.md`, then write these sections:

- **Current state**: one paragraph describing where the site stands *right now* — visual style, copy approach, what's live. Replace, don't append.
- **Last completed**: max 5 bullets, most recent first, each dated `YYYY-MM-DD`. Each bullet = one meaningful change (what changed + why it matters). Drop the oldest bullet if already at 5.
- **In progress**: clear it if nothing is actively unfinished. Never leave stale entries.
- **Next up**: reorder to reflect current queue. Remove anything completed.
- **Decisions log**: add any non-obvious choices made this session — format: `**Decision name**: one sentence on what was decided and why`. Skip anything obvious from reading the code.

### 2. Write the next session starter

Append a `## Next session starter` section to STATUS.md. Write a ready-to-paste prompt (~10 lines) that gives the next Claude instance full context:

- What the site is and who it's for
- What was done this session (2–3 bullet summary)
- Exactly where to pick up next (specific file, component, or task)
- Any gotchas or constraints to carry forward

Format it as a fenced code block so Michael can copy it cleanly.

### 3. Deploy (if not already deployed this session)

Run `npx vercel --prod --yes` only if there are uncommitted or undeployed changes. Skip if deploy already happened this session.

### 4. Confirm

Output a single line: `Session closed. STATUS.md updated. Next session starter written.`
