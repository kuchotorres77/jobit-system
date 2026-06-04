# Jobit React (Migración)

Este proyecto es un **esqueleto migrado** desde tu app Angular, usando **React + Vite + TypeScript + React Router + React Hook Form + Tailwind**.

## Scripts
- `npm install`
- `npm run dev` (levanta en http://localhost:5173)

## Estructura principal
- `/src/pages/home` → Home
- `/src/pages/auth/login` → Login
- `/src/pages/auth/register` → Registro con subcomponentes (SubRubro, DiaHora)
- `/src/types` → Tipos migrados desde Angular (`ISubRubro`, `IDisponibilidad`)

## Pendiente por migrar
- Navbar/Sidebar originales si aplican
- Servicios HTTP y SEO
- Validaciones y UI exacta a 1:1 del HTML Angular
- Componentes adicionales (Icon, Footer avanzado, Select avanzado)

Puedes ir pegando lógica/estilos específicos en los componentes ya creados.
