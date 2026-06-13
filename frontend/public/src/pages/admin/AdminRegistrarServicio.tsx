import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { ApiError, crearRubro } from "@/api";

export default function AdminRegistrarServicio() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [subrubros, setSubrubros] = useState<string[]>([""]);
  const [guardando, setGuardando] = useState(false);

  const actualizarSubrubro = (index: number, valor: string) => {
    setSubrubros((prev) => prev.map((s, i) => (i === index ? valor : s)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombreLimpio = nombre.trim();
    const subrubrosLimpios = subrubros.map((s) => s.trim()).filter(Boolean);

    if (!nombreLimpio) {
      Swal.fire({ title: "Ingresá el nombre del rubro", icon: "warning" });
      return;
    }
    if (subrubrosLimpios.length === 0) {
      Swal.fire({ title: "Agregá al menos un subrubro", icon: "warning" });
      return;
    }

    setGuardando(true);
    try {
      const rubro = await crearRubro({
        nombre: nombreLimpio,
        subrubros: subrubrosLimpios.map((s) => ({ nombre: s })),
      });
      await Swal.fire({
        title: "Servicio registrado",
        text: `${rubro.nombre} con ${rubro.subrubros.length} subrubro(s).`,
        icon: "success",
      });
      navigate("/admin/servicios/buscar");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "Error al registrar", text: message, icon: "error" });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Registrar Servicio
      </h1>

      <form onSubmit={onSubmit} className="space-y-8">
        <div>
          <label htmlFor="nombre" className="block mb-1 text-sm font-semibold text-gray-700">
            Rubro
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej.: Herrería"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Subrubros</span>
            <button
              type="button"
              onClick={() => setSubrubros((prev) => [...prev, ""])}
              className="flex items-center gap-1 rounded-md bg-jobit-violeta-700 px-2.5 py-1.5 text-xs text-white hover:opacity-90 transition"
            >
              <Plus size={14} /> Agregar subrubro
            </button>
          </div>
          <div className="space-y-2">
            {subrubros.map((subrubro, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={subrubro}
                  onChange={(e) => actualizarSubrubro(i, e.target.value)}
                  placeholder={`Subrubro ${i + 1}`}
                  className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                />
                {subrubros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setSubrubros((prev) => prev.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-700 transition"
                    aria-label="Quitar subrubro"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-6">
          <button
            type="button"
            className="text-sm font-semibold"
            onClick={() => navigate("/admin/servicios")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="rounded-md bg-orange-400 px-3 py-2 text-sm text-white disabled:opacity-60"
          >
            {guardando ? "Registrando..." : "Registrar Servicio"}
          </button>
        </div>
      </form>
    </div>
  );
}
