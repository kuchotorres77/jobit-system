import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { ApiError, eliminarRubro, getRubros, Rubro } from "@/api";

export default function AdminBuscarServicio() {
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setRubros(await getRubros());
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "Error al cargar", text: message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const filtrados = useMemo(() => {
    const texto = q.trim().toLowerCase();
    if (!texto) return rubros;
    return rubros.filter(
      (rubro) =>
        rubro.nombre.toLowerCase().includes(texto) ||
        rubro.subrubros.some((s) => s.nombre.toLowerCase().includes(texto)),
    );
  }, [rubros, q]);

  const eliminar = async (rubro: Rubro) => {
    const respuesta = await Swal.fire({
      title: `¿Eliminar "${rubro.nombre}"?`,
      text: "Se eliminan también sus subrubros. Si algún prestador lo usa, la operación se rechaza.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!respuesta.isConfirmed) return;

    try {
      await eliminarRubro(rubro.id);
      setRubros((prev) => prev.filter((r) => r.id !== rubro.id));
      Swal.fire({
        title: "Servicio eliminado",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "No se pudo eliminar", text: message, icon: "error" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Buscar Servicio</h1>

      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filtrar por rubro o subrubro"
        className="w-full border border-gray-300 rounded-md py-2 px-3 mb-8 focus:outline-none focus:border-blue-700"
      />

      {loading ? (
        <p className="text-center text-gray-500 py-12">Cargando servicios...</p>
      ) : filtrados.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No hay rubros que coincidan.</p>
      ) : (
        <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl shadow-sm">
          {filtrados.map((rubro) => (
            <li key={rubro.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{rubro.nombre}</p>
                <p className="text-xs text-gray-500 truncate">
                  {rubro.subrubros.map((s) => s.nombre).join(" · ") || "Sin subrubros"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/admin/servicios/${rubro.id}`}
                  className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Pencil size={14} /> Modificar
                </Link>
                <button
                  type="button"
                  onClick={() => eliminar(rubro)}
                  className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
