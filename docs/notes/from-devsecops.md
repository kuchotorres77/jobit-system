# Notes from DevSecOps

Communication from DevSecOps to other agents. Entries older than 14 days should be purged.

---

## [2026-06-10] → To: All

**Subject:** Endpoints sin protección JWT
**Priority:** Medium
**Action Required:** Yes

`PUT /api/prestador/:id`, `DELETE /api/prestador/:id` y `POST /api/rubro/create` no exigen autenticación. Cualquier cliente puede modificar o eliminar prestadores y crear rubros. Agregar el middleware `checkJwt` (`src/middleware/session.ts`) a estas rutas antes de exponer el API públicamente.

---
