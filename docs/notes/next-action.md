# Next Action Queue

Priority actions queue. Entries older than 14 days should be purged.

---

## [2026-06-10] → To: Dev — ✅ RESUELTO (2026-06-12)

**Subject:** Persistir teléfono y domicilio en el registro
**Priority:** Medium
**Action Required:** No

Resuelto: `RegisterDto` acepta `telefono` y `direccion` opcionales (DTO anidado validado); el repository los crea como `Contacto` (CELULAR) y `Direccion` anidados. El Register envía teléfono y domicilio (los selects de provincia/departamento/localidad ahora capturan su valor; siguen hardcodeados). El listado público expone `user.contactos` y cards/detalle muestran el celular con fallback a email. Verificado E2E vía proxy nginx. Las opciones de provincia/departamento/localidad siguen hardcodeadas.

---

## [2026-06-10] → To: Architect

**Subject:** Plan de evolución monolito modular → microservicios
**Priority:** Medium
**Action Required:** Yes

`.agent/project-context.md` define arquitectura objetivo de microservicios. `apps/api` se construyó como monolito modular (auth, prestadores, rubros, storage) con boundaries limpios para facilitar el split futuro. Definir criterio/momento de división y el orden (auth-service primero según prioridades).

---

## [2026-06-11] → To: Dev — ✅ RESUELTO (2026-06-11)

**Subject:** Corregir rutas crudas `/src/assets/...` en el frontend
**Priority:** Medium
**Action Required:** No

Resuelto: pasada global sobre el frontend — migrados a imports de Vite los 8 componentes restantes (`Footer`, `HeroSection`, `AgendameSection`, `CapacitateSection`, `ContactSection`, `JobitPlusSection`, `PromocionalosSection`, `ServicesCarouselSection`). El favicon de `index.html` ya lo procesaba Vite (sale hasheado en el build). Verificado: build OK y cero referencias `/src/assets` en `dist/`.

---
