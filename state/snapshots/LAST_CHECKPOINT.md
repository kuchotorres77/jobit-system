# Last Checkpoint — 2026-06-13 (sesión 3)

## Sesión summary

Sesión de admin portal: módulo backend `AdminService`/`AdminController` (CRUD de Jobits: crear/buscar/modificar/eliminar, todos con guard ADMIN), endpoints `PUT/DELETE /rubros/:id` admin-only con `RubroEnUsoException` (409) en cascade FK. Frontend: 9 pantallas del portal (`AdminInicio`, `AdminMenuJobit`, `AdminMenuServicios`, `AdminRegistrarJobit`, `AdminBuscarJobit`, `AdminModifJobit`, `AdminRegistrarServicio`, `AdminBuscarServicio`, `AdminServicioDetalle`), componentes `MenuOpciones` y `Volver`, `AdminLayout` con guard de rol ADMIN y botón Volver integrado en el header (mismo nivel del breadcrumb, `flex justify-between`) usando `destinoVolver(pathname)`. NavbarUser con links "Mis favoritos" y "Administración" (solo ADMIN). 58 tests unitarios pasando.

## Estado actual

- Branch: `main` (tracking `origin/main`)
- Last commit: `0857a84 docs(notes): checkpoint snapshot 2026-06-12 sesion 2`
- Working tree: 19 archivos modificados + 20 nuevos (todo trabajo del agente, auto-commit pendiente)
- Stack Docker: postgres (5435) + api-nest (13005) + frontend (80)
- Plan activo: no hay sistema de planes; se trabaja por inferencia desde `docs/notes/`

## Próximo step recomendado

1. **Usuario**: crear OAuth Client ID en Google Cloud Console → `GOOGLE_CLIENT_ID=` en `.env` raíz → `docker compose up -d --build` (sin esto el botón de Google no aparece).
2. **Desarrollo**: bookings/solicitudes (workflow CREATED→ACCEPTED→IN_PROGRESS→COMPLETED en `.agent/project-context.md`).

## Comandos para resumir

1. `/workflows-project-resume` (recovery completo)
2. Verificar stack: `docker compose ps` + `http://localhost/admin`

## Backlog discovered esta sesión

- Bookings/solicitudes (siguiente dominio de la visión)
- Votos "Es útil" en opiniones (frame Buscar-Jobit 2; necesita tabla de votos)
- Verificación de email + recupero de contraseña
- Flujo "convertirme en proveedor" para cuentas de Google (nacen CUSTOMER sin documento/password)

## Notas para próxima sesión

- Admin portal construido sin poder ver los frames Figma (429 en todos los renders) — validar visualmente contra los frames cuando la rate limit se libere.
- `apps/api-service/.env.docker` estuvo trackeado en git: credenciales Mongo en la historia — rotar si se reutilizaron.
- Sesiones logueadas antes del RBAC tienen JWT sin `role` → re-login para endpoints con guard de rol.
- Usuarios demo: `*@jobit.demo` / `Jobit123!`; admin: `admin@jobit.demo` (ADMIN).
- `SubRubroComponent` bug corregido: `i > 0` → `subRubroArray.length > 1` para poder borrar el primer ítem.
