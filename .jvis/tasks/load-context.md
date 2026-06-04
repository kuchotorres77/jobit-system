# Load Context Task

## Purpose
Load relevant project context at session start for continuity between sessions.

## Execution Steps

### STEP 1: Read Project Log
Read `docs/notes/project-log.md` and extract:
- Last 3 entries (most recent activity)
- Any entries marked as BLOCKING or URGENT

### STEP 2: Read Relevant Agent Notes
Based on your agent role, read the appropriate `docs/notes/from-*.md` files.
Skip any files that don't exist (expected for new projects).

| Your Role | Read Notes From |
|-----------|-----------------|
| Analyst | from-pm.md, from-architect.md |
| PM | from-analyst.md, from-architect.md, from-dev.md, from-po.md |
| Architect | from-pm.md, from-dev.md, from-devsecops.md, from-qa.md |
| PO | from-pm.md, from-sm.md, from-dev.md, from-qa.md |
| SM | from-pm.md, from-architect.md, from-dev.md, from-po.md |
| UX Expert | from-pm.md, from-architect.md, from-dev.md |
| Dev | from-architect.md, from-sm.md, from-qa.md, from-devsecops.md, from-ux.md |
| QA | from-dev.md, from-architect.md, from-devsecops.md, from-sm.md |
| DevSecOps | from-dev.md, from-architect.md, from-qa.md |

### STEP 3: Read Lessons Learned
Read `docs/notes/lessons-learned.md` — last 10 items only. Focus on actionable patterns.

### STEP 4: Check Next Actions
Read `docs/notes/next-action.md` for pending actions assigned to your role.

### STEP 5: Read Context Map (if exists)
If `docs/notes/context-map.md` exists:
1. Parse YAML front-matter for `project_root`, `primary_language`, `stack`, `last_updated`
2. If `last_updated` > 30 days old, note staleness
3. If file doesn't exist, skip silently

### STEP 6: Present Summary and Ready State
Show a 3-line summary:
```
Context loaded: [current phase] | Last activity: [date] | Pending: [count items for your role]
Key reminders: [1-2 relevant lessons-learned items]
Ready to assist.
```

## Important Notes
- If any file doesn't exist, skip it silently (new project)
- Focus on ACTION items and DECISIONS, not verbose history
- Flag any CONFLICTS or BLOCKERS prominently
