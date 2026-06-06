# Bootstrap: Replicate Claude Code Environment

Run this skill once after cloning this repo to a new machine or project folder.
It sets up all global and project-local config so the experience is identical to the original.

---

## Step 1: Detect platform

Run `echo $HOME` and `uname -s` to determine platform (Linux vs Windows/Cygwin).
Set `HOME_DIR` to the result of `echo $HOME`.

---

## Step 2: Write global CLAUDE.md

Write the following to `${HOME_DIR}/.claude/CLAUDE.md` (create or overwrite):

```
# Global Claude Code Instructions

## Model Tag
Every response MUST begin with [Model: Haiku], [Model: Sonnet], or [Model: Opus].

## Subagent Routing
| Task | Model |
|---|---|
| Search / read / grep / glob | Haiku |
| Code writing / editing (default) | Sonnet |
| Architecture / planning / design | Opus |

Model IDs: haiku=claude-haiku-4-5-20251001, sonnet=claude-sonnet-4-6, opus=claude-opus-4-8

## Agent Announcements
Before every Agent call output: "Spawning [type] on [Model] — [task]"
```

---

## Step 3: Create global session hook

Create `${HOME_DIR}/.claude/hooks/` if it doesn't exist.

Write the following to `${HOME_DIR}/.claude/hooks/global-session-start.sh`:

```bash
#!/usr/bin/env bash
jq -n '{"hookSpecificOutput":{"additionalContext":"GLOBAL: Start every response with [Model: Haiku/Sonnet/Opus]. Route subagents: Haiku=search/reads, Sonnet=code (default), Opus=architecture. Announce every Agent spawn."}}'
```

Make it executable: `chmod +x ${HOME_DIR}/.claude/hooks/global-session-start.sh`

---

## Step 4: Merge global settings.json

Read `${HOME_DIR}/.claude/settings.json`. If it doesn't exist, start from `{}`.

Merge in these settings (do not remove existing keys, only add/update):

```json
{
  "autoUpdatesChannel": "stable",
  "tui": "fullscreen",
  "skipDangerousModePermissionPrompt": true,
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "theme": "dark",
  "remoteControlAtStartup": true,
  "agentPushNotifEnabled": true,
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [{ "type": "command", "command": "${HOME}/.claude/hooks/global-session-start.sh", "timeout": 10 }]
      },
      {
        "matcher": "resume",
        "hooks": [{ "type": "command", "command": "${HOME}/.claude/hooks/global-session-start.sh", "timeout": 10 }]
      },
      {
        "matcher": "compact",
        "hooks": [{ "type": "command", "command": "${HOME}/.claude/hooks/global-session-start.sh", "timeout": 10 }]
      }
    ]
  }
}
```

**Windows only:** also merge `"env": { "CLAUDE_CODE_USE_POWERSHELL_TOOL": "1" }`.

Use `jq` to merge: `jq -s '.[0] * .[1]' existing.json new.json > merged.json && mv merged.json settings.json`

---

## Step 5: Write global settings.local.json

Write the following to `${HOME_DIR}/.claude/settings.local.json` (create or overwrite):

```json
{
  "permissions": {
    "allow": [
      "mcp__claude_ai_Google_Drive__get_file_metadata",
      "mcp__claude_ai_Google_Drive__download_file_content",
      "Skill(update-config)"
    ]
  }
}
```

---

## Step 6: Verify project-local config

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
- `CLAUDE.md`
- `AGENTS.md`
- `STATUS.md`

---

## Step 7: Report what needs manual action

After completing the above, output a checklist of items that require manual steps:

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
