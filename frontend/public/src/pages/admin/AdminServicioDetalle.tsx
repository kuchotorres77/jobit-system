import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  ApiError,
  eliminarRubro,
  getRubro,
  updateRubro,
  Rubro,
} from "@/api";

interface SubrubroForm {
  id?: string;
  nombre: string;
}

export default function AdminServicioDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [rubro, setRubro] = useState<Rubro | null>(null);
  const [nombre, setNombre] = useState("");
  const [subrubros, setSubrubros] = useState<SubrubroForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!id) return;
    getRubro(id)
      .then((data) => {
        setRubro(data);
        setNombre(data.nombre);
        setSubrubros(data.subrubros.map((s) => ({ id: s.id, nombre: s.nombre })));
      })
      .catch((error) => {
        const message =
          error instanceof ApiError
            ? error.message
            : "No se pudo conectar con el servidor";
        Swal.fire({ title: "Error al cargar", text: message, icon: "error" }).then(
          () => navigate("/admin/servicios/buscar"),
        );
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rubro) return;

    const nombreLimpio = nombre.trim();
    const subrubrosLimpios = subrubros
      .map((s) => ({ ...s, nombre: s.nombre.trim() }))
      .filter((s) => s.nombre);

    if (!nombreLimpio) {
      Swal.fire({ title: "Ingresá el nombre del rubro", icon: "warning" });
      return;
    }
    if (subrubrosLimpios.length === 0) {
      Swal.fire({ title: "El rubro necesita al menos un subrubro", icon: "warning" });
      return;
    }

    setGuardando(true);
    try {
      const actualizado = await updateRubro(rubro.id, {
        nombre: nombreLimpio,
        subrubros: subrubrosLimpios,
      });
      setRubro(actualizado);
      setNombre(actualizado.nombre);
      setSubrubros(actualizado.subrubros.map((s) => ({ id: s.id, nombre: s.nombre })));
      Swal.fire({
        title: "Servicio actualizado",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "No se pudo guardar", text: message, icon: "error" });
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    if (!rubro) return;
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
      await Swal.fire({
        title: "Servicio eliminado",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      navigate("/admin/servicios/buscar");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "No se pudo eliminar", text: message, icon: "error" });
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-24">Cargando servicio...</p>;
  }
  if (!rubro) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Servicio — {rubro.nombre}
        </h1>
        <button
          type="button"
          onClick={eliminar}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition shrink-0"
        >
          Eliminar Servicio
        </button>
      </div>

      <form onSubmit={guardar} className="space-y-8">
        <div>
          <label htmlFor="nombre" className="block mb-1 text-sm font-semibold text-gray-700">
            Rubro
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Subrubros</span>
            <button
              type="button"
              onClick={() => setSubrubros((prev) => [...prev, { nombre: "" }])}
              className="flex items-center gap-1 rounded-md bg-jobit-violeta-700 px-2.5 py-1.5 text-xs text-white hover:opacity-90 transition"
            >
              <Plus size={14} /> Agregar subrubro
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Los subrubros que elimines acá se borran al guardar; si alguno tiene
            prestadores asociados, el guardado se rechaza.
          </p>
          <div className="space-y-2">
            {subrubros.map((subrubro, i) => (
              <div key={subrubro.id ?? `nuevo-${i}`} className="flex items-center gap-2">
                <input
                  type="text"
                  value={subrubro.nombre}
                  onChange={(e) =>
                    setSubrubros((prev) =>
                      prev.map((s, j) => (j === i ? { ...s, nombre: e.target.value } : s)),
                    )
                  }
                  placeholder={`Subrubro ${i + 1}`}
                  className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                />
                <button
                  type="button"
                  onClick={() => setSubrubros((prev) => prev.filter((_, j) => j !== i))}
                  className="text-red-500 hover:text-red-700 transition"
                  aria-label="Quitar subrubro"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-6">
          <button
            type="button"
            className="text-sm font-semibold"
            onClick={() => navigate("/admin/servicios/buscar")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="rounded-md bg-orange-400 px-3 py-2 text-sm text-white disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
