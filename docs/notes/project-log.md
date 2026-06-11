# Project Log

Central project state. Entries older than 7 days should be purged.

---

## Current State

### Project Mission

JOBIT es una plataforma de publicación de servicios: un usuario registrado publica los servicios que ofrece (limpieza, mecánico, carpintero, albañil, etc.) y un portal público permite a cualquier visitante buscar prestadores sin iniciar sesión.

Visión completa (ver `.agent/project-context.md`): marketplace con bookings, reviews, geolocalización, portfolio, RBAC administrativo y arquitectura de microservicios (api-gateway, auth-service, provider-service, catalog-service, booking-service, review-service, realtime-service).

### Estado de la migración de backend

**En curso: Express + MongoDB → NestJS + Prisma + PostgreSQL.**

- `apps/api` (NUEVO): NestJS 11 + Prisma 6 + PostgreSQL 17. Monolito modular con módulos auth, prestadores, rubros, storage — diseñado para poder dividirse en los microservicios de la visión.
- `apps/api-service` (LEGADO): Express + Mongoose. Solo referencia; no agregar features.
- Frontend `frontend/public` (React + Vite): aún apunta a la API legada; migrar consumo a rutas nuevas.

### Completed Features

- **apps/api (nuevo)**: auth (register/login JWT 2h + bcrypt), CRUD prestadores con ownership, rubros + subrubros, upload (Multer, campo `myfile`, 5 MB), paginación `{data, meta}`, rate limiting (global 100/min, auth 10/min), validación DTO global, excepciones de dominio + filtro, repository pattern, 15 tests unitarios pasando, Dockerfile multi-stage, migración Prisma `init` aplicada
- Esquema Prisma: User, Prestador (1:1 User), Rubro, Subrubro, Servicio (zonaCobertura[]), Disponibilidad, Contacto, Direccion, StorageFile; enums Sexo, DiaSemana, TipoContacto
- docker-compose: agregado `postgres:17-alpine` (host **5435**) y `api-nest` (host **3005**) — los puertos 3000-3002/5433/5434/6379 los ocupa otro proyecto (queue-system) corriendo en Docker en esta máquina
- Smoke test E2E manual OK: register → login → crear rubro → crear prestador con servicio/disponibilidad → listado público → 401 sin token

### In Progress

- Nada en curso. Pendiente inmediato: commitear el trabajo de la migración.

---

## Activity Log

## [2026-06-11] Agent: Claude (checkpoint)

### Completed
- Checkpoint de cierre de sesión: commit `0f9f363` (71 archivos — backend NestJS completo, capa API del frontend, docs, infra)
- Snapshot en `state/snapshots/2026-06-11-checkpoint-snapshot.yaml` + `LAST_CHECKPOINT.md`
- `.gitignore`: agregado `*.tsbuildinfo`

### Pendiente de decisión del usuario
- Archivos del usuario sin commitear: `.agent/project-context.md` (reescrito por el usuario con visión marketplace), `.jvis/tasks/*.md`, `.dockerignore`

### Next Steps
- Página pública de búsqueda de prestadores (API y cliente listos)
- Persistir teléfono/domicilio del Register

---

## [2026-06-10] Agent: Claude

### Completed
- Inicializada estructura `docs/notes/`
- Scaffolding completo de `apps/api` (NestJS + Prisma + PostgreSQL): 40+ archivos, build limpio, 15 tests unitarios pasando
- Migración Prisma `20260610234116_init` aplicada en postgres local (puerto 5435)
- Smoke test completo contra el API corriendo (puerto 3005)
- `.gitignore` ampliado (`.env.*`, storage de uploads); `allowScripts` raíz habilita postinstall de Prisma
- Usuario actualizó `.agent/project-context.md` con la visión completa de marketplace (microservicios)
- **Seed de rubros**: `prisma/seed.ts` con 10 rubros / 39 subrubros, ejecutado contra postgres local (`npx -w @jobit/api prisma db seed`)
- **Frontend conectado a la API nueva** (antes no tenía NINGUNA integración — formularios simulados):
  - Capa `src/api/` tipada: client (fetch + Bearer), token/session (localStorage), auth, rubros, prestadores
  - `Login.tsx`: login real (email + password), guarda sesión, SweetAlert de error
  - `Register.tsx`: carga rubros de la API ("Rubro — Subrubro"), campos password agregados, flujo register → login → createPrestador con mapeo de días a enum (Miércoles → MIERCOLES)
  - `VITE_API_URL` en `.env` (default `http://localhost:3005/api`); fix bug preexistente en `AppLayout.tsx`
  - Build frontend OK; flujo E2E verificado contra la API corriendo

### Blockers
- Ninguno

### Next Steps
- Seed de rubros iniciales (Plomería, Electricidad, Carpintería, etc.)
- Migrar frontend a la API nueva
- Refresh tokens + RBAC (roles customer/provider/admin de la visión)
- Decidir cuándo dividir el monolito modular en microservicios según `.agent/project-context.md`

---
