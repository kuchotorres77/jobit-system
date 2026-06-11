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

## [2026-06-11] Agent: Claude — Stack completo en Docker + checkpoint

### Completed
- Stack dockerizado y verificado: `postgres` (5435) + `api-nest` (3005, corre `prisma migrate deploy` al boot) + `frontend` (nginx en 80)
- nginx proxy `/api/` → `api-nest:3000` (frontend consume same-origin, sin CORS, accesible desde la LAN); build del frontend con `VITE_API_URL=/api`
- `apps/api/.env.docker` creado (gitignoreado); `frontend` ahora `depends_on: api-nest`
- Servicios legados (`mongodb` + `api` Express) siguen en compose pero NO se levantan — candidatos a eliminar
- **Seguridad**: `.env.example` raíz contenía el token real de Figma → saneado con placeholder antes de commitear (el real quedó solo en `.env`)

### Next Steps
- Eliminar `apps/api-service` + `mongodb` del compose cuando el usuario confirme paridad
- Persistir teléfono/domicilio del Register

---

## [2026-06-11] Agent: Claude — Rediseño según Figma (Buscar-Jobit)

### Completed
- Acceso a Figma vía API con `API_TOKEN_FIGMA` + `URL_FIGMA` del `.env` raíz (file key `rdNjA5MlzX9plDGHueK9lS`; el token necesitó scope `file_content:read`). Frames renderizados en `screenshots/buscar-jobit-{1,2}.png`
- `/servicios` rediseñada según frame **Buscar-Jobit** [2052:496]: SearchBar de pills (Rubro/Sub-rubro/Ubicación + Buscar índigo #242557), título "Jobit" naranja font Shadows, cards con foto-placeholder de iniciales + rubro uppercase + corazón favorito + zonas + horario + contacto, "Ver más" (load-more)
- Nueva página detalle `/servicios/:id` según frame **Buscar-Jobit 2** [2072:928]: banner placeholder, descripción, disponibilidad, departamentos, chips de servicios, card de contacto. SearchBar navega de vuelta al listado con filtros por URL (`?rubro=&subrubro=&zona=`)
- NavbarUser ajustado al diseño (link "Servicios", botón Ingresar #242557)

### Gaps vs diseño (datos que aún no existen)
- Fotos de prestadores (galería) → placeholder con iniciales; requiere vincular uploads al perfil
- Teléfono WhatsApp → se muestra email; requiere persistir Contacto
- Rating/estrellas y "Opiniones destacadas" → omitidos; requiere review feature
- Favoritos (corazón) → solo estado local; requiere usuarios customer + persistencia

---

## [2026-06-11] Agent: Claude — Búsqueda pública de prestadores

### Completed
- API: filtros en `GET /api/prestadores` — `rubroId`, `subrubroId`, `zona` (match exacto en zonaCobertura), `q` (texto insensible en nombre/apellido/descripción). Nuevo `FindPrestadoresQueryDto`, `buildWhere` en repository. 16 tests pasando.
- Frontend: página pública `/servicios` — filtros por rubro/subrubro (dependiente)/zona/texto, cards de prestadores (servicios, zonas, disponibilidad), paginación. Link "Buscar Servicios" en NavbarUser.
- E2E verificado: sin filtro (2), por rubro, por subrubro, por zona, por texto, combinado sin match (0), UUID inválido → 400.

### Next Steps
- Persistir teléfono/domicilio del Register
- Página de detalle de prestador (`getPrestador()` ya existe en el cliente)

---

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
