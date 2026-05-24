#!/usr/bin/env bash
# Elevates Claude Code model routing rules to the global level.
# Run this once from any folder. Safe to re-run.

set -e

echo "Setting up global Claude Code configuration..."

# 1. Global instructions file
cat > /home/michaek/.claude/CLAUDE.md << 'EOF'
# Global Claude Code Instructions

## Model Tag
Every response MUST begin with [Model: Haiku], [Model: Sonnet], or [Model: Opus].

## Subagent Routing
| Task | Model |
|---|---|
| Search / read / grep / glob | Haiku |
| Code writing / editing (default) | Sonnet |
| Architecture / planning / design | Opus |

Model IDs: haiku=claude-haiku-4-5-20251001, sonnet=claude-sonnet-4-6, opus=claude-opus-4-7

## Agent Announcements
Before every Agent call output: "Spawning [type] on [Model] — [task]"
EOF
echo "✓ Created ~/.claude/CLAUDE.md"

# 2. Hook script
mkdir -p /home/michaek/.claude/hooks
cat > /home/michaek/.claude/hooks/global-session-start.sh << 'EOF'
#!/usr/bin/env bash
jq -n '{"hookSpecificOutput":{"additionalContext":"GLOBAL: Start every response with [Model: Haiku/Sonnet/Opus]. Route subagents: Haiku=search/reads, Sonnet=code (default), Opus=architecture. Announce every Agent spawn."}}'
EOF
chmod +x /home/michaek/.claude/hooks/global-session-start.sh
echo "✓ Created ~/.claude/hooks/global-session-start.sh"

# 3. Add hook to global settings (preserves existing content)
SETTINGS="/home/michaek/.claude/settings.json"
HOOKS='{"SessionStart":[{"matcher":"startup","hooks":[{"type":"command","command":"${HOME}/.claude/hooks/global-session-start.sh","timeout":10}]},{"matcher":"resume","hooks":[{"type":"command","command":"${HOME}/.claude/hooks/global-session-start.sh","timeout":10}]},{"matcher":"compact","hooks":[{"type":"command","command":"${HOME}/.claude/hooks/global-session-start.sh","timeout":10}]}]}'
jq --argjson hooks "$HOOKS" '. + {hooks: $hooks}' "$SETTINGS" > /tmp/claude_settings_tmp.json
mv /tmp/claude_settings_tmp.json "$SETTINGS"
echo "✓ Updated ~/.claude/settings.json with hooks"

echo ""
echo "Done. Global model routing is now active across all Claude Code projects."
echo "Restart Claude Code for changes to take effect."
