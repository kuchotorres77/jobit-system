import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Search, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  adminEliminarUsuario,
  ApiError,
  getPrestadores,
  Prestador,
} from "@/api";

const PAGE_SIZE = 10;

export default function AdminBuscarJobit() {
  const [q, setQ] = useState("");
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const buscar = async (pagina: number, texto: string, acumular = false) => {
    setLoading(true);
    try {
      const result = await getPrestadores({
        page: pagina,
        limit: PAGE_SIZE,
        q: texto.trim() || undefined,
      });
      setPrestadores((prev) =>
        acumular ? [...prev, ...result.data] : result.data,
      );
      setTotal(result.meta.total);
      setPage(result.meta.page);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "Error al buscar", text: message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void buscar(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eliminar = async (prestador: Prestador) => {
    const respuesta = await Swal.fire({
      title: `¿Eliminar a ${prestador.user.nombre} ${prestador.user.apellido}?`,
      text: "Se elimina la cuenta completa: perfil, servicios, fotos y opiniones. Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!respuesta.isConfirmed) return;

    try {
      await adminEliminarUsuario(prestador.userId);
      setPrestadores((prev) => prev.filter((p) => p.id !== prestador.id));
      setTotal((prev) => prev - 1);
      Swal.fire({
        title: "Jobit eliminado",
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

  const hayMas = prestadores.length < total;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Buscar Jobit</h1>

      {/* Buscador */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void buscar(1, q);
        }}
        className="flex gap-3 mb-8"
      >
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, apellido o descripción"
          className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#242557] px-4 py-2 text-sm text-white flex items-center gap-2 disabled:opacity-60"
        >
          <Search size={16} /> Buscar
        </button>
      </form>

      {/* Resultados */}
      {loading && prestadores.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Buscando...</p>
      ) : prestadores.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No se encontraron prestadores.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl shadow-sm">
          {prestadores.map((prestador) => {
            const rubros = [
              ...new Set(prestador.servicios.map((s) => s.subrubro.rubro.nombre)),
            ];
            return (
              <li
                key={prestador.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {prestador.user.nombre} {prestador.user.apellido}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {rubros.join(" · ")} — {prestador.user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/admin/jobits/${prestador.id}`}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Pencil size={14} /> Modificar
                  </Link>
                  <button
                    type="button"
                    onClick={() => eliminar(prestador)}
                    className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {hayMas && (
        <div className="flex justify-end mt-6">
          <button
            type="button"
            disabled={loading}
            onClick={() => buscar(page + 1, q, true)}
            className="text-sm font-semibold text-gray-700 underline underline-offset-4 hover:text-jobit-violeta-900 transition disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Ver más"}
          </button>
        </div>
      )}
    </div>
  );
}
