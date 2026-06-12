# Last Checkpoint — 2026-06-12

## Sesión summary
Se resolvió el bug de producción de los assets crudos (`/src/assets/...` devolvía el index.html vía nginx): pasada global migrando 10 componentes a imports de Vite, incluyendo dos rutas con formato distinto que el grep inicial no detectaba (`Register.tsx` con ruta relativa, `ImageSlider.tsx` con `/assets/`). Después se renombraron 18 imágenes a minúsculas sin espacios (con `git mv`, espacios → guiones) actualizando todas las referencias. Se agregó Swagger/OpenAPI a `apps/api` (plugin CLI con introspectComments + bearer auth + tags por controller; UI en `/api/docs`). Stack Docker reconstruido y verificado E2E (frontend 200, imagen renombrada 200 image/png, `/api/rubros` 200 vía proxy, Swagger 200 directo y vía nginx).

## Estado actual
- Branch: `main` (tracking `origin/main`)
- Commits de la sesión: `4f11c4c` (rename imágenes + imports Vite), `85c4437` (Swagger) + checkpoint docs
- Working tree post-checkpoint: solo `docker-compose.yml` modificado (**cambio del usuario**: comentó los servicios legados `mongodb` + `api` Express — decidir si commitear comentados o eliminar los bloques)
- Stack Docker corriendo: postgres (5435), api-nest (13005), frontend nginx (80); Swagger en http://localhost/api/docs
- Plan activo: no configurado (`core-config.yaml` no existe)

## Próximo step recomendado
Persistir teléfono/domicilio del Register: agregar campos opcionales al RegisterDto (o endpoint de perfil) usando las tablas `Contacto`/`Direccion` existentes y enviarlos desde el frontend. Esto además habilita mostrar WhatsApp en las cards (gap de Figma).

## Comandos para resumir
1. `/workflows-project-resume` (recovery completo)
2. `docker compose up -d` si el stack está abajo (verificar con `docker compose ps`)

## Backlog discovered esta sesión
- Decidir destino de los servicios legados comentados en `docker-compose.yml` (eliminar bloques vs commitear comentados)

## Notas para próxima sesión
- Swagger UI: http://localhost/api/docs (bearer auth persistente; demo: `juan.perez@jobit.demo` / `Jobit123!`)
- Los `package-lock.json` están gitignoreados en este repo (preexistente, no es un olvido)
- El postinstall de `@scarf/scarf` (telemetría transitiva de swagger) está bloqueado por `allowScripts` — intencional
- Backlog vigente: búsqueda `q` insensible a tildes (`unaccent`), migrar `package.json#prisma` → `prisma.config.ts`, plan monolito → microservicios
