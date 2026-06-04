# Save Context Task

## Purpose
Document all work performed during the session before closing. This ensures no knowledge is lost between sessions and other agents can continue the work seamlessly.

## Execution Steps

### STEP 1: Summarize Session Work
Review everything done in this session and create a summary:
- Tasks completed
- Decisions made
- Problems encountered
- Solutions implemented

### STEP 2: Update Project Log
Add an entry to `docs/notes/project-log.md` with format:

```markdown
## [YYYY-MM-DD HH:MM] - {Agent Name} ({Agent Role})

**Session Summary:**
- [Bullet points of what was accomplished]

**Decisions Made:**
- [Any technical or product decisions]

**Issues/Blockers:**
- [Any problems encountered or unresolved issues]

**Next Steps:**
- [What should happen next]

---
```

### STEP 3: Write Notes for Other Agents
If your work affects other agents, write to your `docs/notes/from-{role}.md` file:

```markdown
## [YYYY-MM-DD] → To: {Target Agent(s)}

**Subject:** [Brief description]
**Priority:** High/Medium/Low
**Action Required:** Yes/No

[Details of what they need to know or do]

---
```

### STEP 4: Update Next Actions
If there are clear next steps, update `docs/notes/next-action.md`:

```markdown
## Pending Actions

### For {Role}:
- [ ] [Action item with context]

### For {Another Role}:
- [ ] [Action item with context]
```

### STEP 5: Record Lessons Learned (if applicable)
If you discovered something important that should NEVER be forgotten, add to `docs/notes/lessons-learned.md`:

```markdown
## [YYYY-MM-DD] - {Category}

**Lesson:** [What was learned]
**Context:** [Why this matters]
**Action:** [What to do/avoid in the future]

---
```

### STEP 5.5: Update Context Map Timestamp

If `docs/notes/context-map.md` exists:
1. Update the `last_updated` field in the YAML front-matter to today's date (YYYY-MM-DD format)
2. Do **NOT** modify any other fields in the context-map
3. If the file does not exist, skip this step silently

### STEP 6: Confirm Save Complete
Display confirmation to user:

```
╔══════════════════════════════════════════════════════════════╗
║  CONTEXT SAVED                                               ║
╠══════════════════════════════════════════════════════════════╣
║  ✓ Project log updated                                       ║
║  ✓ Agent notes written: [list files updated]                 ║
║  ✓ Next actions: [count] items pending                       ║
║  ✓ Lessons learned: [if any added]                           ║
╚══════════════════════════════════════════════════════════════╝

Session documented. Safe to close.
```

## Important Notes
- NEVER skip this task when exiting
- Be concise but complete - future you (or another agent) needs this
- Focus on ACTIONABLE information, not verbose logs
- If nothing significant happened, still log "Review session - no changes"
- Mark any URGENT items clearly for immediate attention
