# Last Checkpoint — 2026-06-12 (sesión 2)

## Sesión summary

Sesión grande de features sobre `apps/api` + frontend: refresh tokens opacos con rotación y detección de reuso, RBAC (CUSTOMER/PROVIDER/ADMIN, registro crea PROVIDER, rubros solo ADMIN), login con Google (GIS; requiere `GOOGLE_CLIENT_ID`), vista `/perfil` del proveedor (datos, teléfono/domicilio, fotos, CRUD de servicios), reviews según frame Figma Buscar-Jobit 2 (opiniones + evaluación general + form con login requerido), rating en cards y favoritos persistidos con página `/favoritos`, fotos de perfil/galería servidas por la API, búsqueda insensible a tildes (`unaccent`), migración a `prisma.config.ts`, y eliminación definitiva del backend legado `apps/api-service`. 43 tests unitarios, 5 migraciones nuevas, todo verificado E2E contra el stack Docker.

## Estado actual

- Branch: `main` (tracking `origin/main`)
- Commits de la sesión: `669da56` (refactor: eliminar legado) + `8cc6d1f` (feat: sesión) + checkpoint docs
- Working tree: clean post-checkpoint
- Stack Docker: postgres (5435) + api-nest (13005) + frontend (80) corriendo con las imágenes nuevas
- Plan activo: no hay sistema de planes; se trabaja por inferencia desde `docs/notes/`

## Próximo step recomendado

1. **Usuario**: crear OAuth Client ID (tipo Web) en Google Cloud Console y setear `GOOGLE_CLIENT_ID=` en el `.env` raíz → `docker compose up -d --build` lo inyecta a backend y frontend. Sin esto el botón de Google no aparece (todo lo demás funciona).
2. **Desarrollo**: arrancar **bookings/solicitudes** (workflow CREATED→ACCEPTED→IN_PROGRESS→COMPLETED de `.agent/project-context.md`), o los votos "Es útil" de opiniones si se prefiere algo chico.

## Comandos para resumir

1. `/workflows-project-resume` (recovery completo)
2. Verificar stack: `docker compose ps` + `http://localhost/servicios`

## Backlog discovered esta sesión

- Bookings/solicitudes (siguiente dominio de la visión)
- Votos "Es útil" en opiniones (frame Buscar-Jobit 2; necesita tabla de votos)
- Verificación de email + recupero de contraseña
- Flujo "convertirme en proveedor" para cuentas de Google (nacen CUSTOMER sin documento/password)

## Notas para próxima sesión

- `apps/api-service/.env.docker` estuvo trackeado en git: las credenciales del Mongo legado quedan en la historia del repo — rotar si se reutilizaron.
- Sesiones logueadas antes del RBAC tienen JWT sin `role` → re-login para endpoints con guard de rol.
- Figma API tira 429 enseguida: espaciar llamadas y revisar `screenshots/` antes de re-renderizar (hay renders de Buscar-Jobit, Buscar-Jobit 2 y los nodos JSON de reviews).
- Usuarios demo: `*@jobit.demo` / `Jobit123!`; admin: `admin@jobit.demo` (ADMIN).
