<!-- Powered by JVIS -->

# Resume Session

## Purpose

Recover complete project context and establish an action plan for the current session, enabling seamless continuation of work.

## Task Instructions

### 0.5. Config Health Check

Before checking the plan, verify the plan system is configured:

- Read `core-config.yaml`
- **If `plans` section is missing:**
  - Add to Priority Tasks: "Plan system not configured. Run `/sm *migrate-config` to set up."
  - Do NOT block session resume — continue with inference-based approach
- **If `plans` section exists but `docs/plans/` directory is missing:**
  - Create directories silently: `docs/plans/`, `docs/plans/reports/`, `docs/plans/checkpoints/`, `docs/plans/archive/`
- **If both exist:** proceed to Step 1

### 1. Check Active Plan (Fast Path)

**FIRST:** Read `docs/plans/active-plan.yaml` (from `core-config.yaml` → `plans.activePlan`).

- **If the file exists and `status` is `pending` or `in_progress`:**
  - Extract: plan name, total steps, completed steps, current/next step, any triggered checkpoints
  - **Check triggered checkpoints:** Scan `checkpoints` array for any entry where:
    - `status: pending` AND all `after_steps` have `status: done`
    - If found: add to Critical priority:
      ```
      CHECKPOINT PENDING: {id} — {title}
      Reviewers: {reviewers}. Must complete before next epic.
      ```
  - This is the **primary state source** — use it to determine where the project is and what's next
  - Still read the files below for human context, but the plan file answers "what's next" definitively
- **If the file does not exist or `status` is `completed`/`abandoned`:**
  - Fall back to the inference-based approach below (read all context files)

### 2. Read Project Context

**IMPORTANT:** Follow the progressive-read pattern (`.jvis/tasks/_patterns/progressive-read.md`).
Read each file individually, extract key points (max 200 words), then synthesize.
Do NOT read all 6+ files simultaneously.

Load and analyze the following files:

#### Primary Context
- `docs/notes/project-log.md` - Current project state and recent activity

#### Inter-Agent Communication
- `docs/notes/next-action.md` - Priority actions queue
- `docs/notes/from-architect.md` - Notes from Architect
- `docs/notes/from-qa.md` - Notes from QA
- `docs/notes/from-devsecops.md` - Security-related notes

#### Permanent Knowledge
- `docs/notes/lessons-learned.md` - Accumulated learnings

### 3. Generate Session Summary

After reading the documentation, generate a **concise summary** including:

#### Recent Context
- What was worked on last session
- Key decisions made
- Any unresolved issues

#### Current State
- Project status right now
- What's working
- What's in progress

#### Pending Tasks
Generate a clear prioritized list:

1. **Critical/Blocked Items**
   - Items from `next-action.md`
   - Architect instructions from `from-architect.md`
   - Security issues from `from-devsecops.md`

2. **In Progress**
   - Tasks that were started but not completed

3. **Backlog**
   - Other pending items

### 4. Check for Missing Capabilities

Analyze the project stack and verify if recommended agents are installed:

#### Detect Project Stack
Check for these files to identify technologies:
- `package.json` → Node.js, React, Expo, Prisma, Vite
- `requirements.txt` / `pyproject.toml` → Python, FastAPI, Flask, boto3
- `Cargo.toml` → Rust
- `build.gradle` → Kotlin/Android
- `Package.swift` → Swift/iOS
- `Dockerfile` / `docker-compose.yml` → Docker
- `.github/workflows/` → CI/CD
- `*.tf` / `terraform/` → Terraform
- `lambdas/` / `lambda/` → AWS Lambda

#### Check Installed Agents
List directories in `.claude/skills/` to see installed agents.

#### Identify Missing Recommended Agents

| If detected... | Recommend... |
|----------------|--------------|
| React/Vite | `/frontend` |
| FastAPI/Flask | `/api` |
| Prisma/Express | `/prisma` |
| Expo | `/eas` |
| Kotlin/Android | `/kotlin` |
| Swift/iOS | `/swift` |
| Rust | `/rust` |
| Docker/Terraform | `/infra` |
| boto3/Lambda | `/aws` |
| Any project | `/devsecops` (security) |

#### If Missing Agents Found
Add a notice in the summary:

```
## Capabilities Check
⚠ Missing recommended agents for your stack:
  - /frontend (React + Vite detected)
  - /aws (boto3 detected)

Run from JVIS directory to add:
  ./update-project.sh /path/to/this/project
```

### 4.5. Check for Deprecated Tooling

#### Python Projects: Migrate to Ruff

For Python projects, check if they're using deprecated linting tools:

**Check for deprecated tools:**
- `requirements.txt` contains `black` or `flake8`
- `pyproject.toml` has `[tool.black]` or `[tool.flake8]` sections

**If deprecated tooling detected, add to Priority Tasks:**

```
## ⚠️ Tooling Migration Required

**Migrate Python linting to Ruff** - Current setup uses black/flake8 (deprecated)

Action required:
1. Remove from requirements: `black`, `flake8`, `flake8-docstrings`
2. Add to requirements: `ruff>=0.8.0`
3. Update pyproject.toml:
   - Remove `[tool.black]` section
   - Add/update `[tool.ruff]`, `[tool.ruff.lint]`, `[tool.ruff.format]`
4. Update Makefile/scripts:
   - `ruff check src/` (replaces flake8)
   - `ruff format src/` (replaces black)
   - `ruff check --fix src/` (auto-fix)

Benefits: Ruff is 10-100x faster (written in Rust), single tool, same output as Black.
```

This should be treated as a **High Priority** task as it affects development workflow.

### 5. Identify Starting Point

Based on the analysis, determine:

1. **If active plan exists** — recommend `*continue` (next pending step from plan)
2. **If there's a specific instruction** from `next-action.md` or architect notes
3. **If there's a recent error** to resolve from project-log
4. **If continuing where left off** is the best approach
5. **If a different priority** should be addressed

### 6. Present Options to User

After presenting the summary, ask:

> "Based on the current state, I recommend starting with **[recommended action]**.
>
> Would you like to:
> 1. Proceed with the recommended action
> 2. Address [alternative priority] instead
> 3. Continue from where we left off
> 4. Work on something else
>
> What would you prefer?"

### 7. Transition to Action

Once the user decides:
- Confirm the selected task
- Load any additional context needed
- Begin execution

## Output Format

```markdown
# Session Resume Summary

## Last Session
- Date: [YYYY-MM-DD]
- Focus: [What was being worked on]
- Outcome: [What was accomplished]

## Current State
- [Brief status description]

## Active Plan
✓ Active plan: [plan name] — [X/Y steps done], next: [step_id — title]
  OR
⚠ No active plan found. Use `/sm *generate-plan` to create one.

## Capabilities Check
✓ All recommended agents installed
  OR
⚠ Missing recommended agents:
  - /agent (technology detected)

## Tooling Check
✓ Python tooling is current (Ruff)
  OR
⚠ Deprecated Python tooling detected:
  - Migrate from black/flake8 to Ruff

## Priority Tasks
1. **[Priority]** Task description - Source: [where it came from]
2. **[Priority]** Task description - Source: [where it came from]

## Architect/Security Notes
- [Any pending instructions or issues]

## Recommended Starting Point
[Suggested first action with reasoning]

---

Where would you like to start?
```

## Success Criteria

- [ ] Active plan checked (fast path)
- [ ] Project log fully analyzed
- [ ] Inter-agent notes reviewed
- [ ] Capabilities check completed
- [ ] Tooling check completed (Python: Ruff vs black/flake8)
- [ ] Clear summary presented to user
- [ ] Prioritized task list generated
- [ ] Starting point recommendation provided
- [ ] User preference captured
- [ ] Session ready to proceed
