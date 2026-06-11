# Next Action Queue

Priority actions queue. Entries older than 14 days should be purged.

---

## [2026-06-10] → To: Dev

**Subject:** Persistir teléfono y domicilio en el registro
**Priority:** Medium
**Action Required:** Yes

El form de Register captura teléfono y domicilio pero la API no los recibe aún. Las tablas `Contacto` y `Direccion` ya existen en el schema Prisma: agregar campos opcionales al RegisterDto (o endpoint de perfil) y enviarlos desde el frontend. Las opciones de provincia/departamento/localidad siguen hardcodeadas.

---

## [2026-06-10] → To: Architect

**Subject:** Plan de evolución monolito modular → microservicios
**Priority:** Medium
**Action Required:** Yes

`.agent/project-context.md` define arquitectura objetivo de microservicios. `apps/api` se construyó como monolito modular (auth, prestadores, rubros, storage) con boundaries limpios para facilitar el split futuro. Definir criterio/momento de división y el orden (auth-service primero según prioridades).

---

## [2026-06-11] → To: Dev

**Subject:** Corregir rutas crudas `/src/assets/...` en el frontend
**Priority:** Medium
**Action Required:** Yes

Las imágenes referenciadas con path crudo (`/src/assets/img/...`) devuelven el index.html en el build de producción (nginx). `Login.tsx` ya fue migrado a imports de Vite; quedan al menos `HeroSection.tsx` (bgSrc, logoSrc) y posiblemente otros componentes. Hacer una pasada global con `grep "/src/assets"`.

---
