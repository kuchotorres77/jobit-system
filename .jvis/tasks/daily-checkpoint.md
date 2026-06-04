<!-- Powered by JVIS -->

# Daily Checkpoint

## Purpose

Create a clear checkpoint in the project documentation that allows resuming work without context loss, maintaining a relevant and manageable history.

## Task Instructions

### 1. Create Daily Executive Summary

Add an entry to `docs/notes/project-log.md` with the following structure:

```markdown
## [YYYY-MM-DD] - Daily Summary

### Achievements
- Task #1 completed
  - What was finished exactly
  - Why (reason/objective behind this change)
  - What it adds - detailing:
    - **Final State**
    - **Starting Point for Tomorrow**: Next specific task to tackle first

### Blockers (if any)
- [Description of any blockers or impediments]

### Tomorrow's Objective
- Define the next priority task/objective
```

### 2. Apply TTL (Time To Live)

**Policy:** Keep only the last 7 days of entries in project-log.

**Action:**
1. Identify entries older than 7 days
2. Remove old entries while preserving structure
3. Keep permanent sections (Lessons Learned, Configuration) regardless of age

### 3. Update Inter-Agent Communication

If there are notes for other agents (especially architect), update the appropriate file:

**Location:** `docs/notes/from-{agent}.md`

**Format:**
```markdown
## [YYYY-MM-DD] → To: {Recipient}

**Subject:** {Topic}
**Priority:** High/Medium/Low
**Action Required:** Yes/No

{Details}

---
```

### 4. Set Clear Next Action

Ensure `docs/notes/next-action.md` has a clear priority for tomorrow:

```markdown
## Priority Actions

### [High] First Task for Tomorrow

**Owner:** @{Agent}
**Context:** {What needs to be done and why}
**Reference:** {Related story or document}

---
```

### 5. Knowledge Synchronization (Micro-Ciclo)

**If the project uses team sync** (`docs/sync/` exists):

#### 5.1 Fetch Updates from JVIS

```bash
# Check for new knowledge from JVIS
*sync-fetch
```

This will:
1. Compare local experience/ hash with JVIS
2. Pull any new patterns/solutions discovered by other projects
3. Merge intelligently (section-by-section)
4. Report what's new

#### 5.2 Promote Pending Knowledge

If there are items in `docs/sync/knowledge-delta/`:

```bash
# Review pending knowledge
*sync-pending

# For each validated item, promote to JVIS
*sync-promote <id>
```

**IMPORTANT:** Promotion runs automatic quality validation:
- Technical correctness (SOLID, Clean Code)
- Stack conventions compliance
- Security standards (OWASP)
- Score >= 70 required for approval

#### 5.3 Update Team State

Update `docs/sync/team-state.yaml` with:
- Current developer status → "offline" (ending day)
- Work distribution changes (if any)
- Session summary for handoff

### 6. Commit and Push Changes

**If the project has git initialized**, commit and push the daily checkpoint:

**Pre-conditions:**
1. Check if `.git/` directory exists in the project root
2. Verify there are changes to commit (`git status`)

**Actions:**
1. Stage documentation and sync changes:
   ```bash
   git add docs/notes/ docs/sync/
   ```

2. Create commit with standardized message:
   ```bash
   git commit -m "docs: daily checkpoint YYYY-MM-DD"
   ```

3. Push to remote (if configured):
   ```bash
   git push
   ```

**Note:** If push fails (no remote, auth issues), report it but don't block - the local commit is sufficient.

### 7. Dream Consolidation Check

After the daily checkpoint is complete, evaluate whether a dream consolidation is due.

**Check indicators (if ANY is true, recommend dream):**
1. `docs/notes/project-log.md` exceeds 100 lines
2. `docs/notes/lessons-learned.md` exceeds 1000 lines
3. `docs/notes/next-action.md` has 3+ completed items still listed
4. Any `docs/notes/from-*.md` has entries older than 14 days that are NOT archived as HTML comments
5. `~/.claude/projects/*/memory/MEMORY.md` for the current project exceeds 150 lines

**If any indicator is true**, append this notice at the end of the daily checkpoint output:

```
---
> Memory consolidation recommended. Run `/workflows:dream` to clean up project memory.
> Indicators: [list which checks triggered]
```

**If no indicators triggered**, skip silently — do not mention dream at all.

## Golden Rule

**NEVER modify** any file inside the `.jvis/` folder (except experience/ for sync operations).

## Output

Confirm:
1. Daily summary created in project-log.md
2. Old entries purged (list what was removed)
3. Next task clearly defined for tomorrow
4. Any inter-agent communication sent
5. Knowledge sync status (fetched X, promoted Y, pending Z)
6. Git commit/push status (committed, pushed, or skipped if no git)
7. Dream consolidation check result (recommended or skipped)

## Success Criteria

- [ ] Daily summary entry created with proper format
- [ ] Entries older than 7 days purged
- [ ] Tomorrow's first task clearly defined
- [ ] Inter-agent notes updated if needed
- [ ] Knowledge synced with JVIS (if sync enabled)
- [ ] Team state updated (if multi-developer project)
- [ ] Documentation ready for session resumption
- [ ] Changes committed and pushed (if git repository)
- [ ] Dream consolidation check evaluated
