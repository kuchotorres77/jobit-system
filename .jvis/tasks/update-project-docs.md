<!-- Powered by JVIS -->

# Update Project Documentation

## Purpose

Update project documentation (especially `project-log.md`) to accurately reflect current state, removing obsolete information and maintaining communication channels.

## Task Instructions

### 1. Update Project Log

**Location:** `docs/notes/project-log.md`

Update the following sections:

#### Lessons Learned / Errors
If any errors, bugs, or relevant learnings were found, document them:
- What was the issue
- How it was resolved
- How to prevent it in the future

#### Pending Tasks
Update the task list:
- Mark completed tasks as done
- Add any new tasks that emerged
- Update priorities if changed

#### Current State
Describe the current system state concisely:
- What's working
- What's in progress
- Any blockers

### 2. Apply TTL (Time To Live)

**Policy:** Keep only the last 7 days of entries in project-log.

**Action:** Identify and remove entries older than 7 days.

**Caution:** Preserve permanent sections like "Lessons Learned" or "Configuration" that should persist regardless of age.

### 3. Update Inter-Agent Notes

If there are findings relevant to other agents, update the appropriate `from-{agent}.md` file:

**Format:**
```markdown
## [YYYY-MM-DD] → To: {Recipient}

**Subject:** Brief description
**Priority:** High/Medium/Low
**Action Required:** Yes/No

Details of the message...

---
```

### 4. Check for Architect Communication

If there are unresolved issues, complex adjustments made, or questions for the architect, document them in `docs/notes/from-dev.md`:

```markdown
## [YYYY-MM-DD] → To: Architect

**Subject:** {Issue/Question}
**Priority:** High/Medium/Low
**Action Required:** Yes

{Description of the issue or question}

---
```

### 5. Update Next Actions

If priorities have changed, update `docs/notes/next-action.md`:

```markdown
## Priority Actions

### [Priority] Action Title

**Owner:** @{Agent}
**Deadline:** {Date if applicable}
**Context:** {Brief description}
**Reference:** {Link to document or story}

---
```

## Golden Rule

**NEVER modify** any file inside the `.jvis/` folder except through proper task execution.

## Output

Provide a summary of:
- Sections updated in project-log.md
- Entries purged (if any)
- Inter-agent notes created/updated
- Current state summary

## Success Criteria

- [ ] Project log updated with recent changes
- [ ] Old entries (>7 days) purged from log
- [ ] Inter-agent communication updated if needed
- [ ] Next actions updated if priorities changed
- [ ] Structure and content remain coherent
