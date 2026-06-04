# Claude Project Instructions

## Context Loading

Always load and respect these files before any task:

* `.agent/skills.md` — agent routing, parallel strategy, validation pipeline
* `.agent/coding-rules.md` — coding standards and conventions
* `.agent/architecture-principles.md` — architecture decisions and patterns
* `.agent/project-context.md` — stack, services, current priorities

These files define the complete system. Never ignore them.

---

## Execution Mode

For every non-trivial request, follow the agent routing defined in `skills.md`:

1. Identify which agents must activate (use their trigger conditions)
2. Run parallel agents when the strategy calls for it
3. Resolve conflicts using the Conflict Resolution rule
4. Produce a single coherent, production-ready response

For simple, single-concern tasks: activate only the relevant agent.

---

## Environment Variables

Secrets, credentials, API keys, tokens, database URLs, and configuration values are stored in `.env` files.

When generating code:

* Use `ConfigModule` and `ConfigService` in NestJS
* Generate `.env.example` when adding new environment variables
* Never access `process.env` directly in business logic

---

## Repository Safety

Never commit:

* `.env`, `.env.local`, `.env.production`
* Secrets, credentials, tokens, private keys

Always verify `.gitignore` covers new secrets when creating new services.

---

## Output Standards

* Production-ready code only — no placeholders, no pseudo-code
* Code must look human-written and professional
* No AI signatures, AI comments, or AI metadata in generated files
* Suggest improvements proactively when you identify a better approach
