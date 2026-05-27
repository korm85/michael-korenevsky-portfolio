<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:model-routing-rules -->
# Model routing

When spawning subagents via the Agent tool, select the model based on task type.
Use the `model` parameter — never leave it unset for a task that maps to Haiku or Opus.

| Task category | Model | Examples |
|---|---|---|
| Search, lookup, file reads, grep, glob, directory scans | `haiku` | Explore agent, finding files, checking if something exists |
| Code writing, editing, debugging, deploys, refactors | `sonnet` (default) | All standard development work |
| Architecture, planning, design decisions, multi-step analysis | `opus` | Plan agent, reviewing a full system, deciding approach |

Rules:
- If the agent only reads files and reports findings, use `haiku`.
- If the agent writes or edits any code, use `sonnet`.
- If the task starts with "plan", "design", "architect", "review the full", use `opus`.
- When in doubt, use `sonnet`.
- Never use `opus` for search or lookup tasks — it adds cost with no benefit.
<!-- END:model-routing-rules -->

<!-- BEGIN:response-transparency -->
# Response transparency

Every response must begin with `[Model: Haiku]`, `[Model: Sonnet]`, or `[Model: Opus]` — matching the model currently running.
No exceptions. This is required for the user to verify correct model routing on every turn.
<!-- END:response-transparency -->

<!-- BEGIN:subagent-traceability -->
# Subagent traceability

When spawning any subagent via the Agent tool, announce it to the user in the response text before or immediately after the tool call. Format:

> Spawning [agent type] agent on [model] — [one-line task description]

Example: "Spawning Explore agent on Haiku — searching for gradient utility classes in component files."

This gives the user full visibility into which model is being used for each subtask.
<!-- END:subagent-traceability -->

<!-- BEGIN:skill-loading -->
# Required skill loads

Before making ANY change to UI, styling, colors, layout, typography, or component design:
- Invoke the `portfolio-design-system` skill via the Skill tool
- This is mandatory even if it was loaded at session start — the skill may not be in active context

Before writing copy, headlines, or tile content:
- Check if `portfolio-copy-voice` skill applies and invoke it

Before referencing any Oqton product details, customer names, or metrics:
- Invoke the `ip-handling` skill

Before making any changes to settings.json (hooks, permissions, env vars):
- Use the `update-config` skill — it reads, merges, and validates; direct Edit skips the merge step
<!-- END:skill-loading -->

<!-- BEGIN:copy-data-source -->
# Authoritative data source

`docs/product-case-studies.md` is the verified ground truth for all portfolio copy: metrics, customer names, case study outcomes, and product specs. Read it before writing or editing any metric, customer reference, or outcome claim.
<!-- END:copy-data-source -->

<!-- BEGIN:repo-identity -->
# This is the DEVELOPMENT / EXPERIMENT repository

**Official site repo:** `/home/michaek/ClaudeCode-portfolio` → deploys to `https://michael-korenevsky.vercel.app`
**This repo:** `/home/michaek/ClaudeCode-portfolio-dev` → deploys to its own dev Vercel URL

## Rules
- All experimental work, redesigns, and feature exploration happen here.
- NEVER run `npx vercel --prod --yes` targeting the official project from this repo.
- Deploy this repo freely to its own Vercel project for review.
- When Michael explicitly says "push to the official site", copy the relevant changes to `/home/michaek/ClaudeCode-portfolio` and deploy from there.
<!-- END:repo-identity -->

<!-- BEGIN:status-continuity -->
# Project status and continuity

STATUS.md at the project root is the authoritative record of where work stands.

## When to read it
- At the start of any session where the user asks to continue work or asks "where are we"
- When STATUS.md content is not already in context from the SessionStart hook

## When to update it
Use `/done` to close any session with meaningful changes — it updates STATUS.md, writes the next session starter, and deploys in one step.

Manual checklist (if /done unavailable):
- Move completed items into "Last completed" with today's date
- Clear "In progress" if nothing is actively unfinished
- Update "Next up" to reflect the current queue
- Add any non-obvious decisions to "Decisions log"

## Deploy rule
After updating STATUS.md, run `npx vercel --prod --yes` to deploy to THIS repo's Vercel project only.

## Format rules
- "Last completed": max 5 bullets, most recent first, always dated
- "In progress": empty if nothing is actively unfinished — never leave stale entries
- "Next up": ordered list, most immediate first
- "Decisions log": only non-obvious choices — skip anything derivable from reading the code
<!-- END:status-continuity -->
