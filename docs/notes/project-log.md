# Project Log

Central project state. Entries older than 7 days should be purged.

---

## [2026-06-13] Agent: Claude (sesión 5) — Fotos en Register idéntico a Perfil

### Completed
- **Register.tsx — sección Fotos**: refactorizada para ser idéntica a la galería de Configuración de perfil. `foto: File | null` → `fotos: File[]` + `previews: string[]`; previews locales con `URL.createObjectURL()` + revocación al eliminar; grilla de thumbnails 96×96 con botón ✕ (hover); botón `+` dashed igual que Perfil; nota "La primera foto se muestra como foto de perfil en el buscador."; section propia separada de Descripción; onSubmit sube todas las fotos en loop tras login. TypeScript sin errores.

### Decisiones
- Las fotos en Register son locales hasta el submit (sin JWT aún); se suben post-login en loop — misma UX que Perfil pero sin interacción de server durante el llenado del form.
- Se usa `index` como key en el botón ✕ y se revoca la blob URL correspondiente para evitar memory leaks.

### Next Steps
- Configurar SMTP: `MAIL_USER` + `MAIL_PASS` en `.env` raíz (Gmail: App Password)
- Bookings/solicitudes (workflow CREATED→ACCEPTED→IN_PROGRESS→COMPLETED)
- Flujo "convertirme en proveedor" para cuentas Google (nacen CUSTOMER sin password)

---

## [2026-06-13] Agent: Claude (sesión 4) — Eliminar foto de perfil, votos "Es útil", email verification + password reset

### Completed
- **Eliminar imagen en Perfil**: `DELETE /upload/:id` (ownership check + borra disco + DB); frontend: botón ✕ con overlay hover en cada foto, confirmación Swal, estado `eliminandoFoto`, actualización inmediata de galería
- **Votos "Es útil" en reviews**: modelo `Voto` (Prisma, migración `votos_reviews`); `toggleVoto` idempotente; `GET reviews` ahora usa `OptionalJwtAuthGuard` para servir `miVoto` si hay sesión; `POST /reviews/:reviewId/votos` toggle con respuesta `{ votos, miVoto }`; frontend: botón "Es útil" con `ThumbsUp`, conteo, update optimista + rollback en error
- **Verificación de email**: modelo `EmailToken` (Prisma, migración `email_verificacion_y_recupero`); `GET /auth/verify-email?token=xxx` marca email verificado; se envía al registrar en background; página `/verificar-email` en el frontend
- **Recupero de contraseña**: `POST /auth/forgot-password` (envía email solo si tiene password local; no revela si existe); `POST /auth/reset-password` (valida token, cambia pass, revoca todos los refresh tokens); páginas `/olvide-contrasena` y `/nueva-contrasena` en el frontend; link en Login ya apunta a `/olvide-contrasena`
- **MailService** (nodemailer): configurable vía `MAIL_HOST/PORT/USER/PASS/FROM + APP_URL`; emails de verificación y recupero con templates HTML; `.env.example` actualizado
- **`GOOGLE_CLIENT_ID` configurado** por el usuario: login con Google ya funciona en esta instancia
- 58 tests pasando; backend y frontend compilan sin errores de TypeScript

### Decisiones / incidentes
- `Review.votos` y `Review.miVoto` se marcaron opcionales en el tipo frontend para compatibilidad con endpoints que devuelven `ReviewCompleta` sin mapear (propia, opinar)
- `forgotPassword` siempre responde 204 aunque el email no exista (no revela si está registrado); solo envía si tiene password local (cuentas Google no tienen recupero por esta vía)
- `verifyEmail` y `resetPassword` invalidan el token con `usedAt` (no lo borran) para auditoría
- `resetPassword` revoca todos los refresh tokens del usuario al cambiar la contraseña

### Next Steps
- Configurar SMTP: `MAIL_USER` + `MAIL_PASS` en `.env` raíz (Gmail: App Password)
- Bookings/solicitudes (workflow CREATED→ACCEPTED→IN_PROGRESS→COMPLETED)
- Flujo "convertirme en proveedor" para cuentas creadas con Google (nacen CUSTOMER sin password)

---

## [2026-06-13] Agent: Claude (sesión 3) — Portal admin, rubros update/delete, Volver en AdminLayout

### Completed
- **Módulo admin (backend)**: `AdminService` + `AdminController` con guard `ADMIN` en todos los endpoints: `POST /admin/jobits` (crear proveedor completo con dto extendido), `GET /admin/jobits/:id`, `PUT /admin/jobits/:id`, `DELETE /admin/jobits/:id` (elimina user + prestador + datos relacionados en cascada)
- **Rubros PUT/DELETE (admin-only)**: `PUT /rubros/:id` transaccional (renombra rubro + reconcilia subrubros), `DELETE /rubros/:id` con catch P2003 → HTTP 409 `RubroEnUsoException`; specs con 15 tests nuevos
- **Portal admin frontend (9 pantallas)**: `AdminLayout` (guard de rol ADMIN, breadcrumb + Volver en misma línea `flex justify-between`), `AdminInicio`, `AdminMenuJobit`, `AdminMenuServicios`, `AdminRegistrarJobit`, `AdminBuscarJobit`, `AdminModifJobit` (carga datos del prestador, edita todos los campos), `AdminRegistrarServicio`, `AdminBuscarServicio`, `AdminServicioDetalle` (carga rubro existente, edita nombre + subrubros)
- **Componentes admin reutilizables**: `MenuOpciones` (grid de cards de navegación), `Volver` (link con ArrowLeft, shrink-0)
- **`Volver` en AdminLayout**: `destinoVolver(pathname)` deriva el destino correcto desde el pathname (cubre rutas dinámicas `/admin/jobits/:id`, `/admin/servicios/:id`, `/admin/*/registrar`, `/admin/*/buscar`) — removido de páginas individuales
- **NavbarUser**: links "Mis favoritos" y "Administración" (visible solo a ADMIN)
- **Router**: rutas `/admin/*` con `AdminLayout` como wrapper, todas anidadas

### Decisiones / incidentes
- Figma API: 429 en todos los renders de los 9 frames del admin — portal construido siguiendo convención de diseño del sistema existente sin poder ver los frames. Espaciar llamadas o usar `/v1/files/{key}/nodes?ids=` (JSON) en su lugar
- `SubRubroComponent`: bug donde solo se podía borrar items que no fueran el primero (`i > 0`), corregido a `subRubroArray.length > 1`
- `JobitSelect`/`JobitDiaHora`: no sincronizaban el `value` externo al precargar datos → `useEffect([value, multiple])` para que el estado local se actualice cuando el padre provee datos

### Next Steps
- Crear OAuth Client ID en Google Cloud Console → `GOOGLE_CLIENT_ID` en `.env` raíz
- Bookings/solicitudes (workflow CREATED→ACCEPTED→IN_PROGRESS→COMPLETED)
- Votos "Es útil" en opiniones
- Verificación de email + recupero de contraseña

---

## Current State

### Project Mission

JOBIT es una plataforma de publicación de servicios: un usuario registrado publica los servicios que ofrece (limpieza, mecánico, carpintero, albañil, etc.) y un portal público permite a cualquier visitante buscar prestadores sin iniciar sesión.

Visión completa (ver `.agent/project-context.md`): marketplace con bookings, reviews, geolocalización, portfolio, RBAC administrativo y arquitectura de microservicios (api-gateway, auth-service, provider-service, catalog-service, booking-service, review-service, realtime-service).

### Estado del backend

**Migración Express + MongoDB → NestJS + Prisma + PostgreSQL COMPLETADA** (2026-06-12: `apps/api-service` eliminado del repo).

- `apps/api`: NestJS 11 + Prisma 6 (config en `prisma.config.ts`) + PostgreSQL 17. Monolito modular: auth, prestadores, reviews, favoritos, rubros, storage.
- Frontend `frontend/public` (React + Vite): consume la API nueva same-origin vía proxy nginx.

### Completed Features

- **Auth**: register (rol PROVIDER directo) / login JWT + **refresh tokens** opacos con rotación y detección de reuso / **login con Google** (GIS; `GOOGLE_CLIENT_ID` configurado ✓) / logout con revocación / **RBAC** (`Role` CUSTOMER/PROVIDER/ADMIN) / `GET-PUT /auth/me` / **verificación de email** (token 24h, `GET /auth/verify-email`) / **recupero de contraseña** (`POST /auth/forgot-password` + `POST /auth/reset-password`)
- **Prestadores**: CRUD con ownership, `GET /prestadores/me`, listado público con filtros (`q` insensible a tildes vía `unaccent`) + `rating` agregado por página, teléfono/domicilio persistidos desde el register
- **Reviews**: puntaje 1-5 + comentario, única por usuario/prestador (upsert), resumen con promedio/distribución, dueño bloqueado, **votos "Es útil"** (toggle, conteo por review, `miVoto` para sesión autenticada)
- **Favoritos**: persistidos, endpoints idempotentes, página "Mis favoritos" paginada
- **Storage**: upload solo imágenes (5 MB), `GET /upload/:id` público, **`DELETE /upload/:id`** (ownership check + elimina disco + DB), fotos en cards/detalle/perfil con botón ✕ en hover
- **Admin portal**: `AdminLayout` (guard ADMIN, breadcrumb + Volver), 9 pantallas completas, `AdminService` + `AdminController`, `PUT/DELETE /rubros/:id` admin-only
- Frontend: `/servicios` (+rating y corazón persistido), `/servicios/:id` (+opiniones con botón "Es útil"), `/perfil` (config + eliminar fotos), `/favoritos`, `/admin/*`, `/verificar-email`, `/olvide-contrasena`, `/nueva-contrasena`, login con botón Google y link "Olvidaste tu contraseña?"
- Infra: Swagger en `/api/docs`, rate limiting, **58 tests unitarios**, **8 migraciones Prisma**, nodemailer (SMTP configurable), seed completo (`admin@jobit.demo` / `Jobit123!`)

### In Progress

- Nada en curso. Falta configurar `MAIL_USER` + `MAIL_PASS` en `.env` para activar emails.

---

## Activity Log

## [2026-06-12] Agent: Claude (sesión 2) — Auth completa, perfil, reviews, favoritos, limpieza del legado

### Completed
- **Teléfono/domicilio del register** (next-action 2026-06-10, resuelto): `RegisterDto` con `telefono` y `direccion` opcionales → `Contacto`/`Direccion` anidados; cards y detalle muestran el celular (fallback email); selects de domicilio ahora capturan su valor
- **Búsqueda insensible a tildes**: extensión `unaccent` (preview `postgresqlExtensions`) + query raw para resolver ids del filtro `q`
- **Legado eliminado**: `apps/api-service` completo + bloques comentados y `vmongo` del compose; `docs/overview.md` reescrito al stack actual; nota de DevSecOps marcada resuelta
- **`prisma.config.ts`**: migrado desde `package.json#prisma` (la CLI deja de cargar `.env` sola → `import 'dotenv/config'`); `prisma` movida a dependencies — el `migrate deploy` del boot **bajaba la CLI del registry en cada arranque**
- **Refresh tokens + RBAC**: tokens opacos (SHA-256 en DB) con rotación y detección de reuso que revoca la familia; `JWT_REFRESH_TTL_DAYS` (default 7); enum `Role`, `@Roles` + `RolesGuard`, `POST /rubros` solo ADMIN; crear prestador promueve a PROVIDER; el cliente web renueva en 401 (deduplicado) y el logout revoca
- **Fotos de perfil/galería**: `GET /api/upload/:id` público con content-type, fileFilter solo imágenes, `archivos` en payload de prestadores, volumen `vstorage`, foto en cards/banner/galería, input de foto en register
- **Vista `/perfil`**: `GET/PUT /api/auth/me` + `GET /api/prestadores/me`; edita datos, teléfono/domicilio, descripción, fotos y CRUD de servicios con disponibilidad (reutiliza `SubRubroComponent`; `JobitSelect`/`JobitDiaHora` ahora sincronizan el `value` externo — antes ignoraban datos precargados)
- **Login con Google**: `POST /api/auth/google` verifica el ID token (`google-auth-library`); `password`/`documento` pasaron a nullable; crea cuenta CUSTOMER si el email no existe; botón GIS en el login, oculto sin `GOOGLE_CLIENT_ID` (se configura una vez en el `.env` raíz y alimenta backend + build del frontend)
- **Registro como proveedor**: `register` crea rol PROVIDER directo; botón del login dice "Registrate como Proveedor"
- **Botones del login unificados**: stack ≤400px (límite del botón de GIS), 40px de alto, Roboto 500 14px (fuente agregada vía Google Fonts + `font-roboto` en Tailwind); el botón de Google se renderiza con el ancho medido (ResizeObserver)
- **Reviews según frame Figma Buscar-Jobit 2** [2072:928]: modelo `Review` (1-5 + comentario, única por usuario/prestador, upsert), `GET` lista paginada + resumen (promedio/total/distribución), `POST`/`GET mia`/`DELETE mia`; detalle con "Opiniones destacadas", "Evaluación general" (histograma) y form con estrellas (sin sesión → invita a login; dueño bloqueado 403); 30 opiniones demo en seed
- **Rating en cards + favoritos** según frame Buscar-Jobit [2052:496]: `GET /prestadores` incluye `rating` (un `groupBy` por página); tabla `Favorito` + endpoints idempotentes; corazón con toggle optimista y prompt de login
- **Página `/favoritos`**: `GET /api/favoritos/prestadores` paginado con rating, orden último-guardado-primero; quitar no borra la card (permite deshacer)
- 43 tests unitarios pasando; 5 migraciones nuevas (`unaccent`, `roles_y_refresh_tokens`, `google_login`, `reviews`, `favoritos`); stack Docker redesplegado y cada feature verificada E2E vía proxy

### Decisiones / incidentes
- `apps/api-service/.env.docker` estaba **trackeado en git** → las credenciales del Mongo legado quedan en la historia; rotar si se reutilizaron en otro lado
- Cuentas de Google nacen CUSTOMER sin documento/password — el flujo "completar perfil de proveedor" para esas cuentas queda pendiente
- Tokens emitidos antes del RBAC no traen `role` → sesiones viejas necesitan re-login para endpoints con guard de rol
- API de Figma: rate limit (429) con pocas llamadas seguidas — espaciar requests entre render de frames

### Pendiente de decisión del usuario
- Crear el OAuth Client ID en Google Cloud Console y setear `GOOGLE_CLIENT_ID` en el `.env` raíz para habilitar el login con Google

### Next Steps
- Bookings/solicitudes (siguiente dominio de la visión)
- Votos "Es útil" en opiniones (está en el frame; necesita tabla de votos)
- Verificación de email + recupero de contraseña
- Flujo "convertirme en proveedor" para cuentas creadas con Google

---

## [2026-06-12] Agent: Claude — Fix assets de producción, rename de imágenes, Swagger

### Completed
- **Fix assets crudos** (next-action 2026-06-11, resuelto): migrados a imports de Vite los 10 archivos que referenciaban `/src/assets/...` con strings — `Footer`, `HeroSection`, `AgendameSection`, `CapacitateSection`, `ContactSection`, `JobitPlusSection`, `PromocionalosSection`, `ServicesCarouselSection`, más dos rutas crudas con otro formato que el grep inicial no detectó: `Register.tsx` (`src/assets/...` relativa) e `ImageSlider.tsx` (`/assets/...`, componente sin uso actual). El favicon de `index.html` no necesitaba cambio (Vite procesa los href del index). Verificado: cero referencias `/src/assets` en `dist/`.
- **Rename de imágenes**: 18 archivos de `frontend/public/src/assets/img/` a minúsculas y sin espacios (espacios → guiones), con `git mv` para preservar historia. Referencias actualizadas en todos los componentes. Build OK.
- **Swagger/OpenAPI en `apps/api`**: `@nestjs/swagger` + plugin CLI en `nest-cli.json` (`introspectComments`; los DTOs se documentan solos desde class-validator), `setupSwagger()` en `main.ts` con bearer auth persistente, `@ApiTags`/`@ApiOperation`/`@ApiBearerAuth` en los 4 controllers, schema multipart para `/upload`. UI en `/api/docs` (200 directo en 13005 y vía proxy nginx). 16 tests pasando.
- **Despliegue Docker**: stack completo reconstruido y verificado (frontend 200, imagen renombrada 200 image/png, `/api/rubros` 200 vía proxy).

### Decisiones / incidentes
- El postinstall de `@scarf/scarf` (telemetría, dependencia transitiva de swagger) quedó bloqueado por `allowScripts` — intencional, no aprobar salvo necesidad.
- Los `package-lock.json` están gitignoreados en este repo (preexistente).

### Pendiente de decisión del usuario
- `docker-compose.yml` con `mongodb` + `api` (Express legado) comentados — cambio del usuario sin commitear; decidir si se commitea así o se eliminan los bloques definitivamente.

### Next Steps
- Persistir teléfono/domicilio del Register (Contacto/Direccion ya existen en el schema)
- Búsqueda `q` insensible a tildes (extensión `unaccent` de Postgres)
- Migrar `package.json#prisma` → `prisma.config.ts` (deprecado en Prisma 7)

---

## [2026-06-11] Agent: Claude — Seed demo, sesión en navbar, Login según Figma

### Completed
- **docker-compose**: `api-nest` movido a puerto host **13005** — el 3005 cayó en un rango reservado por WinNAT/Hyper-V (`netsh interface ipv4 show excludedportrange`); esos rangos cambian con cada reinicio de Windows
- `apps/api/.env.docker` y `.env` regenerados (gitignoreados, se habían perdido) con JWT secrets nuevos; volumen postgres recreado desde cero + seed
- **Seeder completo** (`prisma/seed.ts`): además de rubros, 10 prestadores demo logueables (`*.@jobit.demo` / `Jobit123!`, bcrypt rounds 10) con servicios, zonas alineadas a los departamentos de San Juan del frontend, disponibilidades, contactos y direcciones. Idempotente. Verificado E2E vía proxy nginx.
- **NavbarUser con sesión**: avatar de iniciales (gradiente violeta de las cards) + nombre/apellido + menú "Cerrar sesión". Nuevo hook `useSession` + evento `jobit:session-change` disparado por `saveSession`/`clearSession`.
- **Navegación del home**: botón "Buscar" del hero → `/servicios` (antes abría WhatsApp placeholder); links Inicio/Agendame/Capacitate/Contactos como `/#seccion`, funcionan desde cualquier página con scroll suave + offset del navbar; menú mobile se cierra al navegar.
- **Login rediseñado según frame Figma `290:2305`**: tarjeta centrada con grilla 60/40 (violeta más angosto), campos de 57px con subrayado naranja, ojo mostrar/ocultar contraseña, logo arriba a la izquierda, foto pisando el borde del panel violeta (96px) sin tocar el formulario. Botón "Registrarse" conservado a pedido (no está en el frame). Usuario iteró valores finos (paddings, offsets) en conjunto.
- **/servicios**: el título "Jobit" del frame Buscar-Jobit es una imagen (`logo Letras Jobit PNG`), no texto — reemplazado el h1 por el asset `logo LetrasJobit.png` vía import de Vite.
- **Fix producción**: las rutas crudas `/src/assets/...` devuelven el index.html en el build (nginx) — `Login.tsx` migrado a imports de Vite.

### Decisiones / incidentes
- Token de Figma del `.env` raíz estaba en placeholder → el usuario generó uno nuevo (scope `file_content:read`). Render de frames via `GET /v1/images/`.
- Usuario comentó el `server.host` fijo (192.168.1.11) en `vite.config.ts` (cambio propio, fuera del trabajo del agente).

### Backlog discovered
- Rutas crudas `/src/assets/...` restantes (HeroSection: bgSrc, logo LetrasJobit; revisar todo el frontend) — rotas en producción
- Búsqueda `q` sensible a tildes ("cerrajeria" no matchea "Cerrajería") — habilitar extensión `unaccent` de Postgres
- `package.json#prisma` deprecado (Prisma 7) — migrar a `prisma.config.ts`

### Next Steps
- Persistir teléfono/domicilio del Register (Contacto/Direccion ya existen en el schema)
- Corregir las rutas de assets crudas restantes

---

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
