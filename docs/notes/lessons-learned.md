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

- Monorepo simple sin Nx/Turborepo: `apps/api-service` (Express + MongoDB) y `frontend/public` (React + Vite) se despliegan de forma independiente.
- Rutas del API auto-cargadas desde `src/routes/` y montadas bajo `/api`.

---

## Special Configurations

- Vite dev server fijado en `192.168.1.11:5173` (IP de red local, no localhost).
- Puerto API en Docker: `3000:3000`; MongoDB expuesto en `28017:27017`.
- Alias de paths frontend: `@/*` → `src/*`.
