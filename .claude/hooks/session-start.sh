#!/bin/bash
# Injects portfolio design system + project status into session context.
# Runs on every session start (startup + resume + compaction).

SKILL_FILE="${CLAUDE_PROJECT_DIR}/.claude/skills/portfolio-design-system/SKILL.md"
STATUS_FILE="${CLAUDE_PROJECT_DIR}/STATUS.md"

DESIGN_SYSTEM=""
if [ -f "$SKILL_FILE" ]; then
  DESIGN_SYSTEM=$(cat "$SKILL_FILE")
else
  DESIGN_SYSTEM="WARNING: portfolio-design-system skill not found."
fi

STATUS=""
if [ -f "$STATUS_FILE" ]; then
  STATUS=$(cat "$STATUS_FILE")
else
  STATUS="WARNING: STATUS.md not found — project state unknown."
fi

jq -n \
  --arg design "$DESIGN_SYSTEM" \
  --arg status "$STATUS" \
  '{
      "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": ("=== PROJECT STATUS ===\n\n" + $status + "\n\n=== END PROJECT STATUS ===\n\n=== PORTFOLIO DESIGN SYSTEM ===\n\n" + $design + "\n\n=== END DESIGN SYSTEM ===")
      }
   }
  '

exit 0
