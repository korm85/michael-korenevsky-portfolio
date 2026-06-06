#!/bin/bash
# Injects project status into session context.
# Design system is NOT pre-loaded here — AGENTS.md requires explicit skill invocation
# before UI work, which avoids double-loading and keeps the cache warm.

STATUS_FILE="${CLAUDE_PROJECT_DIR}/STATUS.md"

STATUS=""
if [ -f "$STATUS_FILE" ]; then
  STATUS=$(cat "$STATUS_FILE")
else
  STATUS="WARNING: STATUS.md not found — project state unknown."
fi

jq -n \
  --arg status "$STATUS" \
  '{
    "hookSpecificOutput": {
      "hookEventName": "SessionStart",
      "additionalContext": ("=== PROJECT STATUS ===\n\n" + $status + "\n\n=== END PROJECT STATUS ===")
    }
  }'

exit 0
