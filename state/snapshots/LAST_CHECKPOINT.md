# Last Checkpoint — 2026-06-11

## Sesión summary

Se ejecutó la migración del backend de Express + MongoDB a **NestJS 11 + Prisma 6 + PostgreSQL 17** en `apps/api/` (el legado `apps/api-service/` queda como referencia). Se trasladaron los modelos Mongoose a un esquema relacional normalizado, con auth JWT + ownership, validación DTO, repository pattern, 15 tests unitarios y migración `init` aplicada. Se creó el seed de 10 rubros / 39 subrubros. Además se conectó por primera vez el frontend a una API real: capa `src/api/` tipada, Login funcional y Register con flujo completo (registro → login → crear prestador). Todo verificado E2E contra la API corriendo.

## Estado actual

- Branch: `main`
- Last commit: `0f9f363` feat(api): migracion backend a NestJS + Prisma + PostgreSQL e integracion del frontend
- Working tree: quedan archivos DEL USUARIO sin commitear (`.agent/project-context.md`, `.jvis/tasks/*.md`, `.dockerignore`) — decisión del usuario
- Plan activo: no hay plan formal (sistema de planes no configurado)

## Próximo step recomendado

Implementar la **página pública de búsqueda/listado de prestadores** — `GET /api/prestadores` (paginado) y `getPrestadores()` del cliente ya están listos; falta solo la UI. Alternativa: persistir teléfono/domicilio del Register (tablas `Contacto`/`Direccion` ya existen en el schema).

## Comandos para resumir

1. `/workflows-project-resume` (recovery completo)
2. `docker compose up -d postgres` + `npm run start:dev -w @jobit/api` (API en dev)
3. `npm run dev -w jobit-react` (frontend — ojo: vite.config fija host 192.168.1.11)

## Backlog discovered esta sesión

- Persistir teléfono y domicilio del Register (API no los recibe aún)
- Portal público de búsqueda de prestadores
- Refresh tokens + RBAC
- Plan monolito modular → microservicios (visión del usuario en `.agent/project-context.md`)
- Datos de prueba en postgres local para limpiar (`prisma migrate reset` + seed)
- Provincias/departamentos/localidades hardcodeados en el Register

## Notas para próxima sesión

- **Puertos**: otro proyecto (queue-system) corre en Docker y ocupa 3000-3002, 4001, 5173-5177, 5433, 5434, 6379. JOBIT usa **5435** (postgres) y **3005** (api).
- El usuario reescribió `.agent/project-context.md` con la visión completa de marketplace — leerlo antes de diseñar features nuevas.
- `apps/api-service` (Express+Mongo) es solo referencia: NO agregar features ahí.
