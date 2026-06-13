# JOBIT — Resumen del Monorepo

## Descripción general

JOBIT es una plataforma que conecta usuarios con prestadores de servicios (plomeros, técnicos, etc.). Un usuario registrado publica los servicios que ofrece y un portal público permite buscar prestadores sin iniciar sesión.

```
jobit-system/
├── apps/api/             # Backend NestJS + Prisma + PostgreSQL
├── frontend/public/      # Frontend React + Vite + TypeScript
├── docker-compose.yml    # postgres + api-nest + frontend (nginx)
└── package.json          # Workspace raíz (npm workspaces: apps/*, frontend/*)
```

> El backend legado Express + MongoDB (`apps/api-service`) fue eliminado el 2026-06-12 al completarse la migración a NestJS.

---

## API (`apps/api/`)

### Stack

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 (monolito modular: auth, prestadores, rubros, storage) |
| Base de datos | PostgreSQL 17 vía Prisma 6 (config en `prisma.config.ts`) |
| Autenticación | JWT Bearer (2 h) + refresh tokens opacos con rotación y detección de reuso + bcryptjs |
| Autorización | RBAC — enum `Role` (CUSTOMER/PROVIDER/ADMIN), `@Roles()` + `RolesGuard` |
| Validación | class-validator (`ValidationPipe` global, whitelist) |
| Subida de archivos | Multer (campo `myfile`, 5 MB, almacenamiento local) |
| Rate limiting | @nestjs/throttler — global 100/min, auth 10/min |
| Documentación | Swagger/OpenAPI en `/api/docs` |

### Arquitectura interna

Cada módulo de dominio sigue el patrón `controller → service → repository` (los services nunca llaman a Prisma directamente). Excepciones de dominio propias mapeadas a HTTP por un filtro global. Configuración tipada con `ConfigService` + validación Joi.

```
src/
├── main.ts                 # Bootstrap: prefijo /api, ValidationPipe, Swagger
├── config/                 # configuration.ts + validation.schema.ts (Joi)
├── prisma/                 # PrismaService
├── common/                 # excepciones de dominio, filtro, decoradores, DTO de paginación
├── auth/                   # register/login, JWT strategy + guard, users.repository
├── prestadores/            # CRUD con ownership + búsqueda pública con filtros
├── rubros/                 # rubros + subrubros
└── storage/                # upload de archivos
```

### Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | — | Alta de proveedor (acepta `telefono` y `direccion` opcionales); rol PROVIDER |
| POST | `/api/auth/login` | — | Login → JWT + refresh token |
| POST | `/api/auth/google` | — | Login con Google (ID token de GIS); crea la cuenta CUSTOMER si no existe |
| POST | `/api/auth/refresh` | — | Rota el refresh token y devuelve un par nuevo (reuso → revoca todas las sesiones) |
| POST | `/api/auth/logout` | — | Revoca el refresh token (204) |
| GET | `/api/auth/me` | JWT | Datos del usuario actual con contactos y domicilio |
| PUT | `/api/auth/me` | JWT | Actualizar nombre/apellido/teléfono/domicilio |
| GET | `/api/prestadores` | — | Listado público paginado con `rating` (promedio + total); filtros `rubroId`, `subrubroId`, `zona`, `q` (insensible a mayúsculas y tildes vía `unaccent`) |
| GET | `/api/prestadores/me` | JWT | Perfil de prestador propio (404 si no tiene) |
| GET | `/api/prestadores/:id` | — | Detalle de prestador |
| POST | `/api/prestadores` | JWT | Crear perfil de prestador (1:1 con el usuario; promueve el rol a PROVIDER) |
| PUT | `/api/prestadores/:id` | JWT | Actualizar (solo el dueño) |
| DELETE | `/api/prestadores/:id` | JWT | Eliminar (solo el dueño) |
| GET | `/api/prestadores/:id/reviews` | — | Opiniones paginadas + resumen (promedio, total, distribución 1-5) |
| POST | `/api/prestadores/:id/reviews` | JWT | Crear/reemplazar la opinión propia (1 por usuario; el dueño no puede) |
| GET | `/api/prestadores/:id/reviews/mia` | JWT | Opinión propia (404 si no existe) |
| DELETE | `/api/prestadores/:id/reviews/mia` | JWT | Eliminar la opinión propia (204) |
| GET | `/api/favoritos` | JWT | Ids de prestadores favoritos del usuario |
| GET | `/api/favoritos/prestadores` | JWT | Favoritos completos y paginados, con rating (página "Mis favoritos") |
| POST | `/api/favoritos/:prestadorId` | JWT | Marcar favorito (idempotente, 204) |
| DELETE | `/api/favoritos/:prestadorId` | JWT | Quitar favorito (idempotente, 204) |
| GET | `/api/rubros` | — | Listar rubros con subrubros |
| GET | `/api/rubros/:id` | — | Ver rubro |
| POST | `/api/rubros` | JWT + ADMIN | Crear rubro |
| PUT | `/api/rubros/:id` | JWT + ADMIN | Renombrar rubro y reemplazar subrubros (409 si elimina uno en uso) |
| DELETE | `/api/rubros/:id` | JWT + ADMIN | Eliminar rubro (409 si está en uso) |
| POST | `/api/admin/prestadores` | JWT + ADMIN | Alta completa de un Jobit (usuario PROVIDER + perfil) |
| GET | `/api/admin/usuarios/:id` | JWT + ADMIN | Datos de cualquier usuario con contactos y domicilio |
| PUT | `/api/admin/usuarios/:id` | JWT + ADMIN | Actualizar datos de cualquier usuario |
| DELETE | `/api/admin/usuarios/:id` | JWT + ADMIN | Baja completa del usuario (bloquea auto-eliminación) |
| POST | `/api/upload` | JWT | Subir imagen (multipart, campo `myfile`; jpg/png/webp/gif, máx. 5 MB) |
| GET | `/api/upload/:id` | — | Servir un archivo subido (fotos de perfil/galería) |

Colecciones: `{ data: [...], meta: { total, page, limit } }`.

### Modelo de datos (Prisma)

`User` (con `role`; 1:1 `Prestador`, 1:N `Contacto`/`Direccion`/`StorageFile`/`RefreshToken`/`Review`) · `Prestador` → `Servicio[]` (`zonaCobertura[]`, único por subrubro) → `Disponibilidad[]`, `Review[]` · `Review` (puntaje 1-5 + comentario, única por usuario y prestador) · `Favorito` (único por usuario y prestador) · `Rubro` → `Subrubro[]` · `RefreshToken` (hash SHA-256, expiración, revocación). Enums: `Sexo`, `DiaSemana`, `TipoContacto`, `Role`. Extensión `unaccent` habilitada vía migración.

### Seed

`prisma/seed.ts` (idempotente): 10 rubros / 39 subrubros + 10 prestadores demo logueables (`*@jobit.demo` / `Jobit123!`, rol PROVIDER) con servicios, zonas (departamentos de San Juan), disponibilidades, contactos, direcciones y 30 opiniones cruzadas, más `admin@jobit.demo` (rol ADMIN, misma password).

```bash
npx -w @jobit/api prisma db seed
```

### Variables de entorno

Ver `apps/api/.env.example`. Claves: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_TTL_DAYS`, `PORT`, `STORAGE_DIR`, `GOOGLE_CLIENT_ID` (vacío = login con Google deshabilitado). En Docker se usa `apps/api/.env.docker` (gitignoreado); `GOOGLE_CLIENT_ID` se toma del `.env` raíz y alimenta tanto al backend como al build del frontend (`VITE_GOOGLE_CLIENT_ID`).

### Scripts

```bash
npm -w @jobit/api run start:dev   # desarrollo con hot reload
npm -w @jobit/api run build       # nest build
npm -w @jobit/api test            # jest (unit)
```

---

## Frontend (`frontend/public/`)

### Stack

| Capa | Tecnología |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router DOM v6 |
| Formularios | react-hook-form |
| UI | Material UI v7 + Tailwind CSS v3 |
| Iconos | Lucide React + MUI Icons |
| Carrusel | Swiper |
| Alertas | SweetAlert2 |

### Capa de API (`src/api/`)

Cliente `fetch` tipado con Bearer token (`client.ts`), sesión en localStorage (`token.ts`, evento `jobit:session-change`), módulos por dominio (`auth.ts`, `rubros.ts`, `prestadores.ts`). Base URL: `VITE_API_URL` (default `/api` detrás del proxy nginx).

### Paleta de colores (Tailwind extendido)

| Token | Valor |
|---|---|
| `jobit-violeta-900` | `#242557` |
| `jobit-violeta-700` | `#78499A` (color primario) |
| `jobit-violeta-500` | `#A966D9` |
| `jobit-violeta-300` | `#D49CFC` |
| `jobit-orange` | `#FFC54D` |

Fuentes personalizadas: **Shadows** y **Saira**.

### Rutas

```
/                → Home (landing)
/login           → Login (diseño Figma 290:2305; botón Google si hay client ID)
/register        → Register (alta de proveedor)
/servicios       → Búsqueda pública de prestadores (filtros por URL)
/servicios/:id   → Detalle de prestador
/perfil          → Configuración de perfil del proveedor (datos, fotos, servicios)
/favoritos       → Mis favoritos (prestadores guardados, requiere sesión)
/admin/**        → Portal de administración (solo rol ADMIN)
*                → redirige a /
```

### Páginas principales

**`Home`** — Landing: `NavbarUser → HeroSection → AgendameSection → PromocionalosSection → CapacitateSection → ServicesCarouselSection → JobitPlusSection → ContactSection → Footer`.

**`Register`** — Alta de prestador en un solo flujo: datos personales, cuenta y contacto (teléfono), domicilio, descripción y servicios (subrubros con zona + disponibilidad). Ejecuta `register → login → createPrestador`; teléfono y domicilio se persisten como `Contacto`/`Direccion`.

**`/servicios`** — SearchBar de pills (Rubro/Subrubro/Ubicación/texto), cards con foto o iniciales, zonas, horario, contacto (celular si existe, sino email) + calificación con estrella naranja, y corazón de favorito persistido (logueado: toggle optimista contra `/api/favoritos`; anónimo: invita a iniciar sesión). Paginación "Ver más".

**`/perfil`** — Configuración del proveedor: datos personales, teléfono y domicilio (`PUT /api/auth/me`), descripción, galería de fotos (subida inmediata) y CRUD de servicios con zonas y disponibilidad (`PUT /api/prestadores/:id` reemplaza el set completo). Acceso desde el menú del avatar ("Mi perfil").

**`/admin`** — Portal de administración según los frames Admin de Figma (guard de rol ADMIN en `AdminLayout`; acceso desde el menú del avatar). Estructura: Inicio (Jobit/Servicios) → menús → `jobits/registrar` (alta completa), `jobits/buscar` (lista con modificar/eliminar), `jobits/:id` (modificación de datos del usuario + perfil + servicios), `servicios/registrar` (rubro + subrubros), `servicios/buscar` (filtro local con modificar/eliminar) y `servicios/:id` (edición de rubro y subrubros con reemplazo completo).

### Configuración de Vite

- Alias de paths: `@/*` → `src/*`
- Imágenes siempre vía imports de Vite (las rutas crudas `/src/assets/...` se rompen en producción)

---

## Despliegue (Docker Compose)

| Servicio | Imagen | Puerto host | Notas |
|---|---|---|---|
| `postgres` | postgres:17-alpine | 5435 | volumen `vpostgres` |
| `api-nest` | build `apps/api` | 13005 | corre `prisma migrate deploy` al boot; volumen `vstorage` para uploads; 3000-3002/5433/5434/6379 los ocupa otro proyecto y 3005 cae en rangos reservados de WinNAT |
| `frontend` | nginx:alpine | 80 | proxy `/api/` → `api-nest:3000` (same-origin, sin CORS) |

```bash
docker compose up -d --build
```

---

## Flujo de datos principal

```
1. Registro de prestador
   Register (form) → POST /api/auth/register (con telefono/direccion) → users + contactos + direcciones
                   → POST /api/auth/login → JWT
                   → POST /api/prestadores (JWT) → prestador + servicios + disponibilidades

2. Búsqueda pública
   /servicios → GET /api/prestadores?rubroId=&subrubroId=&zona=&q= → cards con contacto

3. Sesión
   JWT + user en localStorage → Authorization: Bearer <token> → NavbarUser reactivo vía useSession
```

---

## Estado del proyecto

- Migración Express + MongoDB → NestJS + Prisma + PostgreSQL **completada** (legado eliminado)
- 58 tests unitarios (auth, prestadores, reviews, favoritos, rubros, admin) — `npm -w @jobit/api test`
- Visión completa (marketplace con bookings, reviews, microservicios): ver `.agent/project-context.md`
- Pendientes próximos: bookings/solicitudes, votos "Es útil" en opiniones, verificación de email y recupero de contraseña
