# Last Checkpoint — 2026-06-11 (checkpoint #2 del día)

## Sesión summary

Se implementó la **búsqueda pública de prestadores** end-to-end: la API ahora filtra por `rubroId`, `subrubroId`, `zona` y `q` (16 tests pasando), y el frontend tiene `/servicios` (buscador de pills + cards + "Ver más") y `/servicios/:id` (detalle con contacto), ambas siguiendo los frames de Figma **Buscar-Jobit** y **Buscar-Jobit 2** (accedidos vía API con el token del `.env` raíz; renders en `screenshots/`). Además quedó el **stack completo corriendo en Docker**: `postgres` (5435) + `api-nest` (3005) + `frontend` (nginx en 80 con proxy same-origin `/api`). Se detectó y saneó el token real de Figma que estaba en `.env.example`.

## Estado actual

- Branch: `main`
- Last commit: `11525ed` feat(servicios): busqueda publica con filtros, paginas segun Figma y stack Docker
- Working tree: clean (tras commit del checkpoint)
- Docker: 3 contenedores up — entrar por `http://localhost/servicios`
- Plan activo: no hay plan formal

## Próximo step recomendado

**Persistir teléfono y domicilio del Register** — las tablas `Contacto` y `Direccion` ya existen en el schema Prisma; falta DTO en la API + envío desde el frontend. Desbloquea el teléfono WhatsApp de las cards del diseño.

## Comandos para resumir

1. `/workflows-project-resume`
2. `docker compose up -d postgres api-nest frontend` (si los contenedores están caídos)

## Backlog discovered esta sesión

- Eliminar `apps/api-service` + `mongodb` del compose (confirmar paridad con el usuario primero)
- Fotos/galería de prestadores; rating + opiniones; favoritos persistentes (gaps vs diseño Figma)
- Provincias/departamentos hardcodeados (migrar a tablas + IDs)

## Notas para próxima sesión

- Figma accesible vía API: `URL_FIGMA` + `API_TOKEN_FIGMA` (scope `file_content:read`) en `.env` raíz; file key `rdNjA5MlzX9plDGHueK9lS`; frames clave: Buscar-Jobit [2052:496], Buscar-Jobit 2 [2072:928], Ser_Un_Jobit [192:2703], Inicio [166:1691], Login [290:2305]
- El frontend dockerizado consume `/api` same-origin (nginx → api-nest); en dev con Vite usa `VITE_API_URL` del `.env` (default `localhost:3005`)
- Puertos ocupados por el queue-system: 3000-3002, 4001, 5173-5177, 5433, 5434, 6379
