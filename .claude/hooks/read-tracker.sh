#!/usr/bin/env bash
# Tracks file reads within a session.
# Fires as PostToolUse on Read — writes paths to a temp file.
# token-check.sh reads this file at the next session start and reports duplicates.

INPUT=$(cat)
FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -z "$FILE" ] && exit 0

TRACKER="/tmp/claude_reads_${CLAUDE_PROJECT_DIR//\//_}.txt"
echo "$FILE" >> "$TRACKER"
