# Portfolio Project

A Claude Code project for building Michael Korenevsky's PM portfolio site.

The site uses a **single-view grid with expand-in-place tiles**. No long scroll. No modal overlays. A recruiter sees the full structure in 5 seconds, drills into pieces by clicking tiles.

## Quick start

```bash
# 1. Unzip this folder
cd portfolio-project

# 2. Initialize git
git init

# 3. Pull the TypeUI Bento design skill
npx typeui.sh pull bento

# 4. Set up MCP servers (see below)

# 5. Start Claude Code in this directory
claude

# 6. First prompt to Claude Code:
# "Read BRIEF.md and all skills (Bento SKILL.md just pulled, plus the four
#  in .claude/skills/). Delete any previous portfolio code. Confirm MCP
#  servers are connected. Build the grid layout with all six tiles in
#  collapsed/preview state only. Apply the gradient palette overrides
#  from BRIEF.md. Show me the grid before adding expansion logic."
```

## Design system: TypeUI Bento + custom overrides

This project uses the **Bento** design skill from TypeUI as the structural and typographic base. Pulled via:

```bash
npx typeui.sh pull bento
```

Reference: https://www.typeui.sh/design-skills/bento

**The brief overrides Bento's default warm-pastel palette with four professional gradient tiles.** Do not use Bento's default tile colors. See "Visual system" in `BRIEF.md` for the exact gradient definitions.

Everything else from Bento (grid structure, card patterns, typography, spacing) stays as Bento ships it.

## How the skills work together

- **Bento SKILL.md**: structural base (grid, card patterns, typography, spacing)
- **BRIEF.md**: architecture (grid + expand-in-place), tile content, palette overrides, interaction rules
- **portfolio-copy-voice**: editorial rules (no em dashes, voice constraints, anti-jargon)
- **ip-handling**: Oqton attribution scrubbing, AI vs. physics distinction
- **portfolio-content-from-drive**: how to pull from Drive MCP
- **portfolio-deploy**: Vercel deployment steps

If Bento and BRIEF.md disagree on a visual detail, **BRIEF.md wins** (it has the project-specific overrides). The other skills are non-negotiable.

## MCP setup

Two MCP servers must be connected before the AMVero and Simulation tiles can be fully built.

### Google Drive MCP

Used to fetch Simulation accuracy data from the shared portfolio folder.

```bash
claude mcp add google-drive npx @modelcontextprotocol/server-gdrive
```

Authenticate with the Google account that has access to the portfolio Drive folder.

Shared folder reference: https://drive.google.com/drive/folders/184rMRm2T_1RM4CjZvGG_wtHHoHYS4Ip2

Verify with `/mcp` inside Claude Code.

### Figma MCP (Dev Mode)

Used to extract design references from the AMVero and Simulation Figma files.

Prerequisite: Figma desktop app installed, logged in, with Dev Mode MCP enabled in Figma settings.

```bash
claude mcp add figma-dev-mode --transport http http://127.0.0.1:3845/mcp
```

The Figma desktop app must be running. Verify with `/mcp` inside Claude Code.

Figma file references:
- AMVero Design: https://www.figma.com/design/Nu8ghzAlidpkeoaiXqlyNm/AMVero-Design
- Simulation flows: https://www.figma.com/board/nYR5upFW85oPRLffvl3vH1/

### If MCP setup fails

The grid scaffold and structure can be built without MCP. AMVero and Simulation tiles use placeholder content for their expanded states until MCP is wired.

## Project structure

```
portfolio-project/
├── BRIEF.md                                # Content, architecture, palette overrides
├── README.md                               # This file
├── SKILL.md (or similar)                   # Bento skill, pulled via CLI
├── .claude/
│   └── skills/
│       ├── portfolio-copy-voice/
│       ├── ip-handling/
│       ├── portfolio-content-from-drive/
│       └── portfolio-deploy/
└── .gitignore
```

## Deployment

See `.claude/skills/portfolio-deploy/SKILL.md`. Short version: install Vercel CLI, run `vercel`, follow prompts.
