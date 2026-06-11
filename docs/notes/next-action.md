# Next Action Queue

Priority actions queue. Entries older than 14 days should be purged.

---

## [2026-06-10] → To: Dev

**Subject:** Commitear el trabajo de la migración
**Priority:** High
**Action Required:** Yes

Pendiente de commit: `apps/api/` completo (NestJS + Prisma + seed), capa `src/api/` del frontend + Login/Register conectados, docker-compose (postgres 5435, api-nest 3005), .gitignore, package.json raíz, docs/notes, `.jvis/tasks/*.md` y `.dockerignore`.

---

## [2026-06-10] → To: Dev

**Subject:** Persistir teléfono y domicilio en el registro
**Priority:** Medium
**Action Required:** Yes

El form de Register captura teléfono y domicilio pero la API no los recibe aún. Las tablas `Contacto` y `Direccion` ya existen en el schema Prisma: agregar campos opcionales al RegisterDto (o endpoint de perfil) y enviarlos desde el frontend. Las opciones de provincia/departamento/localidad siguen hardcodeadas.

---

## [2026-06-10] → To: Architect

**Subject:** Plan de evolución monolito modular → microservicios
**Priority:** Medium
**Action Required:** Yes

`.agent/project-context.md` define arquitectura objetivo de microservicios. `apps/api` se construyó como monolito modular (auth, prestadores, rubros, storage) con boundaries limpios para facilitar el split futuro. Definir criterio/momento de división y el orden (auth-service primero según prioridades).

---

## [2026-06-10] → To: Dev

**Subject:** Limpieza de datos de prueba en postgres local
**Priority:** Low
**Action Required:** No

El smoke test dejó datos en la base local: usuarios juan@test.com y maria@test.com, rubro "Plomeria" (sin tilde, duplicado conceptual de "Plomero" del seed) y 2 prestadores. Limpiar con `prisma migrate reset` + seed cuando moleste.

---
