<!-- Powered by JVIS -->

# Initialize Project Documentation

## Purpose

Establish the base documentation structure for a project to ensure clear understanding and facilitate development continuity across sessions and agents.

## Task Instructions

### 1. Create Documentation Structure

Create the `docs/` directory at project root if it doesn't exist. This folder will contain ALL project documentation.

```bash
mkdir -p docs/notes
```

### 2. Create Project Log (`docs/notes/project-log.md`)

Create the central project log with the following structure:

```markdown
# Project Log

Central project state. Entries older than 7 days should be purged.

---

## Current State

### Project Mission
<!-- Clear description of the main objective -->
<!-- Purpose and reason for the project -->
<!-- Scope and limits -->

### Completed Features
<!-- List of implemented features -->

### In Progress
<!-- Tasks currently in development -->

---

## Activity Log

<!-- Entry format:
## [YYYY-MM-DD] Agent: {Name}

### Completed
- Item 1

### In Progress
- Pending item

### Blockers
- Identified problem

### Next Steps
- Next action

---
-->
```

### 3. Create Lessons Learned (`docs/notes/lessons-learned.md`)

```markdown
# Lessons Learned

Permanent record of knowledge acquired during project development.

---

## Best Practices Identified
<!-- Patterns that work well in this project -->

---

## Mistakes to Avoid
<!-- Decisions that should not be repeated -->

---

## Solutions to Common Problems

<!-- Format:
### [Category] Problem Title

**Symptom:** What was observed
**Cause:** Why it happened
**Solution:** How it was resolved
**Prevention:** How to avoid it in the future

---
-->

---

## Architecture Decisions
<!-- Important decisions and their justification -->

---

## Special Configurations
<!-- Non-obvious configurations that must be maintained -->
```

### 4. Create Inter-Agent Communication Files

Create the following files in `docs/notes/`:

- `from-dev.md` - Developer notes to other agents
- `from-architect.md` - Architect notes to other agents
- `from-qa.md` - QA notes to other agents
- `from-devsecops.md` - DevSecOps notes to other agents
- `next-action.md` - Priority actions queue

Each file should follow this template:

```markdown
# Notes from {Agent Name}

Communication from {Agent} to other agents. Entries older than 14 days should be purged.

---

<!-- Entry format:
## [YYYY-MM-DD] → To: {Recipient/All}

**Subject:** Brief description
**Priority:** High/Medium/Low
**Action Required:** Yes/No

Message details...

---
-->
```

### 5. Verify Structure

After creation, verify the following structure exists:

```
docs/
└── notes/
    ├── project-log.md
    ├── lessons-learned.md
    ├── from-dev.md
    ├── from-architect.md
    ├── from-qa.md
    ├── from-devsecops.md
    └── next-action.md
```

## Output

Confirm creation of all documentation files and display a summary of the structure created.

## Success Criteria

- [ ] `docs/notes/` directory created
- [ ] `project-log.md` created with proper structure
- [ ] `lessons-learned.md` created with proper structure
- [ ] All inter-agent communication files created
- [ ] Structure verified and confirmed
