# JOBIT — Resumen del Monorepo

## Descripción general

JOBIT es una plataforma que conecta usuarios con prestadores de servicios (plomeros, técnicos, etc.). El monorepo contiene dos aplicaciones independientes:

```
jobit-system/
├── apps/api-service/     # Backend Node.js + Express + MongoDB
├── frontend/public/      # Frontend React + Vite + TypeScript
└── package.json          # Workspace raíz (npm workspaces)
```

No hay configuración de workspace en la raíz (no hay package.json raíz ni Nx/Turborepo); cada app se despliega de forma independiente.

---

## API Service (`apps/api-service/`)

### Stack

| Capa | Tecnología |
|---|---|
| Servidor | Express 4 |
| Base de datos | MongoDB 8 vía Mongoose 8 |
| Autenticación | JWT (2 h de expiración) + bcryptjs |
| Subida de archivos | Multer (almacenamiento local `./storage`) |
| Lenguaje | TypeScript (target ES6, CommonJS) |
| Proceso en producción | PM2 sobre Docker Alpine |

### Arquitectura interna

```
src/
├── app.ts                  # Entrada, configura Express y monta rutas dinámicamente
├── config/mongo.ts         # Conexión a MongoDB (DB_URI desde .env)
├── routes/                 # Auto-carga de rutas → montadas en /api
│   ├── auth.ts
│   ├── prestador.ts
│   ├── rubro.ts
│   └── upload.ts
├── controllers/            # Reciben Request/Response, delegan a services
├── services/               # Lógica de negocio (consultas Mongoose, hashing, JWT)
├── models/                 # Esquemas Mongoose
├── interfaces/             # Tipos TypeScript compartidos
├── middleware/
│   ├── session.ts          # checkJwt — valida Bearer token
│   ├── file.ts             # Multer — nombre único con timestamp
│   └── log.ts              # Logging de requests
└── utils/
    ├── jwt.handle.ts
    ├── bcrypt.handle.ts
    ├── error.handle.ts
    └── constantes.ts       # Enums: SEXO, HORARIO, DISPONIBILIDAD, CONTACTO
```

### Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | — | Crear usuario |
| POST | `/api/auth/login` | — | Login → JWT |
| GET | `/api/prestador/` | — | Listar prestadores |
| GET | `/api/prestador/:id` | — | Ver prestador (log middleware) |
| POST | `/api/prestador/create` | JWT | Crear prestador |
| PUT | `/api/prestador/:id` | — | Actualizar prestador |
| DELETE | `/api/prestador/:id` | — | Eliminar prestador |
| GET | `/api/rubro/` | — | Listar rubros |
| GET | `/api/rubro/:id` | — | Ver rubro |
| POST | `/api/rubro/create` | — | Crear rubro |
| POST | `/api/upload` | JWT | Subir archivo |

### Colecciones MongoDB

**`userAuth`** — Usuarios registrados  
`nombre | apellido | documento | email (unique) | password (hash) | timestamps`

**`prestadores`** — Proveedores de servicios  
`nombre | apellido | documento | descripcion | zonaCobetura[] | disponibilidad[] | horarios[] | servicios[]`  
↳ `servicios`: `{ rubro: string, subrubros: [{ nombre, zonaCobertura[], disponibilidad[] }] }`

**`rubros`** — Categorías de servicios  
`nombre | subrubro[]` ↳ `{ nombre }`

**`storage`** — Metadatos de archivos subidos

### Variables de entorno (`.env.example`)

```
DB_URI=mongodb://localhost:27017/jobit
PORT=3001
JWT_SECRET=secreto.01
```

### Despliegue

- **Docker Compose**: servicio `api` (node:20-alpine + PM2) + servicio `mongodb` (8.0.0)
- Puerto API: `3000:3000` | Puerto Mongo: `28017:27017`
- Red interna compartida `backend`
- Volumen persistente `vmongo` para datos de MongoDB

### Scripts

```bash
npm run dev    # nodemon + ts-node (hot reload)
npm run build  # tsc → dist/
npm start      # node dist/app.js
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
/            → Home
/login       → Login
/register    → Register
*            → redirige a /
```

### Páginas y composición

**`Home`** — Landing page formada por secciones:
`NavbarUser → HeroSection → AgendameSection → PromocionalosSection → CapacitateSection → ServicesCarouselSection → JobitPlusSection → ContactSection → Footer`

**`Login`** — Layout dividido (formulario izquierda / imagen derecha). Campos: usuario, password, recordarme. Navegación a Register.

**`Register`** — Formulario multi-sección para alta de prestadores:
1. Datos personales (nombre, apellido, DNI, sexo)
2. Dirección (calle, CP, provincia, departamento, localidad)
3. Contacto (email, teléfono)
4. Servicios (rubro → subrubros con zona de cobertura)
5. Disponibilidad (día + franjas horarias)

### Componentes reutilizables (`src/components/`)

| Componente | Función |
|---|---|
| `JobitInput` | Campo de texto personalizado |
| `JobitInputControlado` | Variante controlada |
| `JobitSelect` | Dropdown personalizado |
| `JobitDiaHora` | Selector día/hora de disponibilidad |
| `NavbarUser` | Barra de navegación |
| `Footer` | Pie de página (logo, redes sociales, contacto) |
| `ImageSlider` | Carrusel de imágenes |

### Tipos principales (`src/types/index.ts`)

```typescript
IDisponibilidad { dia?: string[]; desde?: string; hasta?: string }
ISubRubro { id?: number; nombre?: string; zonaCobertura?: string[]; disponibilidad?: IDisponibilidad[] }
```

### Configuración de Vite

- Dev server en `192.168.1.11:5173`
- Alias de paths: `@/*` → `src/*`

---

## Flujo de datos principal

```
1. Registro de prestador
   Register (form) → POST /api/auth/register → hash pw → guarda en userAuth
                   → POST /api/prestador/create (JWT) → guarda en prestadores

2. Login
   Login (form) → POST /api/auth/login → valida pw → genera JWT (2h)
   Frontend almacena JWT → lo envía en Authorization: Bearer <token>

3. Consulta de prestadores (pública)
   Home/listado → GET /api/prestador/ → MongoDB → respuesta JSON
```

---

## Estado del proyecto

- Estructura bien organizada con separación por capas (MVC en backend, componentes en frontend)
- TypeScript estricto en ambas aplicaciones
- Sin librería de estado global en el frontend (useState local + react-hook-form)
- Sin tipos compartidos entre frontend y backend (posible mejora futura con workspace)
- Proyecto en etapa temprana-media de desarrollo
