#!/usr/bin/env bash
# Autonomous token budget check — runs at every session start.
# Reports injection costs and flags redundant patterns.

tok() { [ -f "$1" ] && echo $(( $(wc -c < "$1") / 4 )) || echo 0; }

TOTAL=0
LINES=""
WARNINGS=""

add() {
  local label="$1" tokens="$2"
  TOTAL=$((TOTAL + tokens))
  LINES="${LINES}  ${label}: ~${tokens}t\n"
}

# Global config (always loaded)
add "~/.claude/CLAUDE.md"   "$(tok "${HOME}/.claude/CLAUDE.md")"

# Project config (always loaded via @AGENTS.md reference)
if [ -n "$CLAUDE_PROJECT_DIR" ]; then
  add "CLAUDE.md"  "$(tok "${CLAUDE_PROJECT_DIR}/CLAUDE.md")"
  add "AGENTS.md"  "$(tok "${CLAUDE_PROJECT_DIR}/AGENTS.md")"

  # Scan session-start hook for what it injects
  HOOK="${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.sh"
  if [ -f "$HOOK" ]; then
    # Skills auto-injected by hook
    while IFS= read -r skill; do
      t=$(tok "${CLAUDE_PROJECT_DIR}/.claude/skills/${skill}/SKILL.md")
      add "hook→skill/${skill}" "$t"
      # Flag if AGENTS.md also mandates explicit invocation of same skill
      if grep -qi "${skill}" "${CLAUDE_PROJECT_DIR}/AGENTS.md" 2>/dev/null; then
        WARNINGS="${WARNINGS}⚠ ${skill} auto-injected by hook AND required by AGENTS.md → loaded twice per session (~${t}t wasted)\n"
      fi
    done < <(grep -oP '(?<=skills/)[^/]+(?=/SKILL\.md)' "$HOOK" 2>/dev/null | sort -u)

    # Status.md breaks prompt cache (changes every session)
    if grep -q "STATUS\.md" "$HOOK" 2>/dev/null; then
      t=$(tok "${CLAUDE_PROJECT_DIR}/STATUS.md")
      add "hook→STATUS.md" "$t"
      WARNINGS="${WARNINGS}⚠ STATUS.md in session hook (~${t}t) changes each session → breaks prompt cache for all content after it\n"
    fi
  fi

  # Redundant reads from previous session (written by read-tracker hook)
  TRACKER="/tmp/claude_reads_${CLAUDE_PROJECT_DIR//\//_}.txt"
  if [ -f "$TRACKER" ]; then
    DUPES=$(sort "$TRACKER" | uniq -d)
    if [ -n "$DUPES" ]; then
      WARNINGS="${WARNINGS}⚠ Files read multiple times last session (re-reading content already in context):\n"
      while IFS= read -r f; do
        COUNT=$(grep -cF "$f" "$TRACKER")
        WARNINGS="${WARNINGS}  ${f} (×${COUNT})\n"
      done <<< "$DUPES"
    fi
    rm -f "$TRACKER"
  fi
fi

# Budget status
STATUS="✓ OK"
[ "$TOTAL" -gt 2000 ] && STATUS="⚠ HIGH"
[ "$TOTAL" -gt 4000 ] && STATUS="❌ EXCESSIVE — consider reducing session-start injections"

REPORT="TOKEN CHECK [${STATUS}] ~${TOTAL} tokens at session start:\n${LINES}"
[ -n "$WARNINGS" ] && REPORT="${REPORT}\nISSUES FOUND:\n${WARNINGS}"

jq -n --arg r "$(printf '%b' "$REPORT")" \
  '{"hookSpecificOutput": {"additionalContext": $r}}'
