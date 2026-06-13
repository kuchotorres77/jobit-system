import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { NavbarUser, Footer } from "@/components";
import { useSession } from "@/hooks/useSession";
import { Volver } from "./components/Volver";

const TITULOS: Record<string, string> = {
  "/admin": "Inicio",
  "/admin/jobits": "Jobit",
  "/admin/jobits/registrar": "Registrar Jobit",
  "/admin/jobits/buscar": "Buscar Jobit",
  "/admin/servicios": "Servicios",
  "/admin/servicios/registrar": "Registrar Servicio",
  "/admin/servicios/buscar": "Buscar Servicio",
};

// Destino del "Volver" según la jerarquía del portal; null en el inicio
function destinoVolver(pathname: string): string | null {
  if (pathname === "/admin") return null;
  if (pathname === "/admin/jobits" || pathname === "/admin/servicios") {
    return "/admin";
  }
  for (const seccion of ["/admin/jobits", "/admin/servicios"]) {
    if (pathname.startsWith(`${seccion}/`)) {
      const resto = pathname.slice(seccion.length + 1);
      // registrar/buscar vuelven al menú; el detalle (:id) vuelve al buscar
      return resto === "registrar" || resto === "buscar"
        ? seccion
        : `${seccion}/buscar`;
    }
  }
  return "/admin";
}

/** Shell del portal admin: exige sesión con rol ADMIN. */
export default function AdminLayout() {
  const user = useSession();
  const { pathname } = useLocation();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;

  const titulo = TITULOS[pathname];
  const volverA = destinoVolver(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarUser />

      <main className="flex-1 container mx-auto px-4 md:px-8 pt-28 pb-16">
        {/* Encabezado del portal: breadcrumb a la izquierda, Volver a la derecha */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck size={18} className="text-jobit-violeta-700" />
            <Link
              to="/admin"
              className="font-semibold text-jobit-violeta-900 hover:underline"
            >
              Administración
            </Link>
            {titulo && titulo !== "Inicio" && (
              <>
                <ChevronRight size={14} />
                <span>{titulo}</span>
              </>
            )}
          </div>
          {volverA && <Volver a={volverA} />}
        </div>

        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
