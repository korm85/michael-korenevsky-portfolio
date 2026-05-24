# Skill: Portfolio Content from Drive

Instructions for using the Google Drive MCP to retrieve Section 3 simulation accuracy metrics and any other portfolio assets stored in the shared Drive folder.

## When to use this skill

- Before writing any metric in Section 3 (physics-based simulation case study)
- When Michael references a document, PDF, or paper in Drive
- When a metric placeholder `[METRIC — PENDING DRIVE PULL]` appears in a draft

## Drive folder

Shared portfolio folder: `https://drive.google.com/drive/folders/184rMRm2T_1RM4CjZvGG_wtHHoHYS4Ip2`

## Retrieval sequence

1. Use `mcp__claude_ai_Google_Drive__search_files` to find relevant documents. Search terms: "simulation accuracy", "predictive simulation", "physics", "paper", "results"
2. Use `mcp__claude_ai_Google_Drive__list_recent_files` if search returns nothing — the folder may contain PDFs with generic names
3. Use `mcp__claude_ai_Google_Drive__read_file_content` or `mcp__claude_ai_Google_Drive__download_file_content` to retrieve the document
4. Extract accuracy improvement numbers, confidence intervals, or benchmark comparisons from the document
5. Record the source document name and the specific claim so it can be cited or cross-checked

## What to extract

For Section 3, the primary data needed is:
- Simulation accuracy improvement figures (percentage improvement vs. baseline or prior method)
- Any benchmark comparisons (e.g., "X% closer to physical test results")
- Time-to-result improvements if present

## Handling missing data

If the Drive MCP is unavailable or the folder is empty:
- Use `[METRIC — PENDING DRIVE PULL]` as a placeholder
- Do not fabricate numbers
- Do not borrow metrics from Section 2 (anomaly detection) and apply them to Section 3
- Note the gap in a code comment so it is visible on the next session

## After retrieval

- Store the extracted metrics in a comment at the top of the Section 3 component file
- Format: `// DRIVE SOURCE: [filename] — [metric] ([date retrieved])`
- This allows future sessions to verify the number without re-pulling from Drive
