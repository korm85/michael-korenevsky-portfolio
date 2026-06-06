#!/usr/bin/env bash
# Sets up global Claude Code config across all projects.
# Run once on any new machine after cloning this repo. Safe to re-run.
# Works on Linux, macOS, and WSL2.

set -e

CLAUDE_DIR="${HOME}/.claude"
mkdir -p "${CLAUDE_DIR}/hooks"

echo "Setting up global Claude Code configuration in ${CLAUDE_DIR}..."

# 1. Global CLAUDE.md
cat > "${CLAUDE_DIR}/CLAUDE.md" << 'EOF'
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
EOF
echo "✓ ${CLAUDE_DIR}/CLAUDE.md"

# 2. Global session hook
cat > "${CLAUDE_DIR}/hooks/global-session-start.sh" << 'EOF'
#!/usr/bin/env bash
jq -n '{"hookSpecificOutput":{"additionalContext":"GLOBAL: Start every response with [Model: Haiku/Sonnet/Opus]. Route subagents: Haiku=search/reads, Sonnet=code (default), Opus=architecture. Announce every Agent spawn."}}'
EOF
chmod +x "${CLAUDE_DIR}/hooks/global-session-start.sh"
echo "✓ ${CLAUDE_DIR}/hooks/global-session-start.sh"

# 3. Global settings.json — merge hooks in, preserve existing keys
SETTINGS="${CLAUDE_DIR}/settings.json"
if [ ! -f "$SETTINGS" ]; then
  echo '{}' > "$SETTINGS"
fi

NEW_SETTINGS=$(jq '. * {
  "autoUpdatesChannel": "stable",
  "tui": "fullscreen",
  "skipDangerousModePermissionPrompt": true,
  "permissions": { "defaultMode": "bypassPermissions" },
  "theme": "dark",
  "remoteControlAtStartup": true,
  "agentPushNotifEnabled": true,
  "hooks": {
    "SessionStart": [
      { "matcher": "startup", "hooks": [{ "type": "command", "command": "${HOME}/.claude/hooks/global-session-start.sh", "timeout": 10 }] },
      { "matcher": "resume",  "hooks": [{ "type": "command", "command": "${HOME}/.claude/hooks/global-session-start.sh", "timeout": 10 }] },
      { "matcher": "compact", "hooks": [{ "type": "command", "command": "${HOME}/.claude/hooks/global-session-start.sh", "timeout": 10 }] }
    ]
  }
}' "$SETTINGS")
echo "$NEW_SETTINGS" > "$SETTINGS"
echo "✓ ${SETTINGS}"

# 4. Global settings.local.json — pre-allowed permissions
cat > "${CLAUDE_DIR}/settings.local.json" << 'EOF'
{
  "permissions": {
    "allow": [
      "mcp__claude_ai_Google_Drive__get_file_metadata",
      "mcp__claude_ai_Google_Drive__download_file_content",
      "Skill(update-config)"
    ]
  }
}
EOF
echo "✓ ${CLAUDE_DIR}/settings.local.json"

echo ""
echo "Done. Restart Claude Code for changes to take effect."
echo "Global config is now active across all projects on this machine."
