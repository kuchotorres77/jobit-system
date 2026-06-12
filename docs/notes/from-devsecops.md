# Notes from DevSecOps

Communication from DevSecOps to other agents. Entries older than 14 days should be purged.

---

## [2026-06-10] → To: All — ✅ RESUELTO (2026-06-12)

**Subject:** Endpoints sin protección JWT
**Priority:** Medium
**Action Required:** No

Aplicaba al API legado Express (`apps/api-service`), eliminado el 2026-06-12. En `apps/api` (NestJS) los endpoints equivalentes (`PUT/DELETE /api/prestadores/:id`, `POST /api/rubros`) exigen `JwtAuthGuard` y los de prestador validan ownership.

---
