# Bootstrap: Replicate Claude Code Environment

Run this skill once after cloning this repo to a new machine or project folder.
It sets up all global and project-local config so the experience is identical to the original.

---

## Step 1: Run the global config script

The repo contains `setup-global-claude.sh` at the project root. It is the single source of truth for global Claude config across all projects on any machine.

Run it:
```bash
bash setup-global-claude.sh
```

This script handles everything global in one shot:
- `~/.claude/CLAUDE.md` (model routing rules, applies to ALL projects)
- `~/.claude/hooks/global-session-start.sh` (session hook, applies to ALL projects)
- `~/.claude/settings.json` (theme, permissions, hook wiring — merged, preserves existing keys)
- `~/.claude/settings.local.json` (pre-allowed MCP permissions)

**Windows (Cygwin/native) only:** after running the script, also add this to `~/.claude/settings.json`:
```json
"env": { "CLAUDE_CODE_USE_POWERSHELL_TOOL": "1" }
```

---

## Step 2: Verify project-local config

Check that the following exist relative to the project root. Report any that are missing:

- `.claude/settings.json`
- `.claude/hooks/session-start.sh`
- `.claude/skills/design-system/`
- `.claude/skills/ip-handling/`
- `.claude/skills/portfolio-content-from-drive/`
- `.claude/skills/portfolio-copy-voice/`
- `.claude/skills/portfolio-deploy/`
- `.claude/skills/portfolio-design-system/`
- `.claude/skills/bootstrap/` (this skill itself)
- `.claude/skills/save/`
- `CLAUDE.md`
- `AGENTS.md`
- `STATUS.md`

---

## Step 3: Report what needs manual action

Output a checklist of items that require manual steps:

### MCP Servers (connect at claude.ai → Settings → Integrations)
These are account-level and not repo-based. Authenticate each one:
- Google Drive
- Gmail
- Google Calendar
- Hugging Face
- Vercel
- Tavily
- tldraw
- Interactive Brokers (IBKR)
- PandaDoc
- PubMed
- Scholar Gateway
- Trivago

### Plugins (install from `/plugins` in Claude Code)
Open Claude Code, type `/plugins`, search for and install each:
- asana
- context7
- discord
- fakechat
- firebase
- github
- gitlab
- greptile
- imessage
- laravel-boost
- linear
- playwright
- serena
- telegram
- terraform

### Final step
Restart Claude Code for all changes to take effect.
