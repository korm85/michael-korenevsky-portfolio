# Save: Checkpoint Current Work to Git

Use this skill when stopping work for the session. It commits everything to git and pushes to remote so you can recover and continue from any machine, even if the current one is lost.

---

## Step 1: Assess current state

Run these in parallel:
- `git status` — see all changed and untracked files
- `git diff` — see what changed in tracked files
- `git log --oneline -5` — see recent commit history for message style

Read `STATUS.md` to understand the current project state.

---

## Step 2: Update STATUS.md

Update STATUS.md to accurately reflect what happened in this session:
- Move completed work into "Last completed" with today's date (format: `YYYY-MM-DD`)
- Keep "Last completed" to max 5 bullets, most recent first
- Set "In progress" to `Nothing. Clean state.` if no work is actively unfinished
- Update "Next up" to reflect the actual queue
- Add any non-obvious decisions to "Decisions log" (skip anything derivable from reading the code)

**Do not invent status.** Only write what actually happened.

---

## Step 3: Stage all project files

Stage everything that belongs in the repo. Use specific paths, not `git add .` blindly.

**Always stage:**
- `STATUS.md`
- All `.claude/skills/` changes
- All `.claude/hooks/` changes
- `.claude/settings.json`
- `CLAUDE.md`, `AGENTS.md`, `BRIEF.md`
- All `app/` changes
- All `public/` changes
- `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- Any new files shown in `git status` that belong to the project

**Never stage:**
- `.env*` files
- `node_modules/`
- `scratch/` directory contents (working scratch space, not source of truth)
- `*.local` files with secrets

If there are deleted files shown in `git status` (prefixed with `D`), stage those deletions too with `git rm --cached` or by including them in `git add`.

---

## Step 4: Write the commit message

Draft a concise commit message (1-2 sentences) that describes **what changed and why**, not a list of files. Follow the style of recent commits.

Format:
```
<summary of what changed>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Commit using a heredoc to preserve formatting:
```bash
git commit -m "$(cat <<'EOF'
<your message here>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Step 5: Push to remote

```bash
git push origin main
```

If the push is rejected due to remote changes ahead, run `git pull --rebase origin main` first, then push again.

---

## Step 6: Confirm

Output a short summary:
- What was committed (1-2 sentences)
- The commit hash
- Confirmation that push succeeded

The work is now safe. You can close the machine.
