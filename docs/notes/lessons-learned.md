# Lessons Learned

Permanent record of knowledge acquired during project development.

---

## Best Practices Identified
<!-- Patterns that work well in this project -->

---

## Mistakes to Avoid

- No copiar plantillas de `.agent/` de otros proyectos sin adaptarlas: `.agent/project-context.md` quedó describiendo un Queue Management System ajeno a JOBIT y desorientó el contexto de las sesiones.

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

- Monorepo simple sin Nx/Turborepo (npm workspaces `apps/*` + `frontend/*`): `apps/api` (NestJS + Prisma + PostgreSQL) y `frontend/public` (React + Vite).
- El backend legado `apps/api-service` (Express + MongoDB) se eliminó el 2026-06-12 al completarse la migración a NestJS.
- API con prefijo global `/api`; el frontend la consume same-origin vía proxy nginx.

---

## Special Configurations

- Puertos Docker: postgres `5435`, api-nest `13005` (3000-3002/5433/5434/6379 los usa queue-system; 3005 cae en rangos reservados de WinNAT), frontend `80`.
- Alias de paths frontend: `@/*` → `src/*`.
