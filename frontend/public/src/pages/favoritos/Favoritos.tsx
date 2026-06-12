import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import Swal from "sweetalert2";
import { NavbarUser, Footer } from "@/components";
import {
  agregarFavorito,
  ApiError,
  getFavoritosPrestadores,
  getToken,
  quitarFavorito,
  Prestador,
} from "@/api";
import { PrestadorCard } from "../servicios/components/PrestadorCard";

const PAGE_SIZE = 12;

export default function Favoritos() {
  const navigate = useNavigate();

  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [quitados, setQuitados] = useState<Set<string>>(new Set());
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const cargar = async (pagina: number, acumular: boolean) => {
    setLoading(true);
    try {
      const result = await getFavoritosPrestadores(pagina, PAGE_SIZE);
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
      Swal.fire({ title: "Error al cargar favoritos", text: message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    void cargar(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // El corazón quita/repone sin sacar la card de la grilla, para poder deshacer
  const toggleFavorito = async (prestadorId: string) => {
    const estabaQuitado = quitados.has(prestadorId);
    setQuitados((prev) => {
      const set = new Set(prev);
      if (estabaQuitado) set.delete(prestadorId);
      else set.add(prestadorId);
      return set;
    });
    try {
      if (estabaQuitado) {
        await agregarFavorito(prestadorId);
      } else {
        await quitarFavorito(prestadorId);
      }
    } catch {
      setQuitados((prev) => {
        const set = new Set(prev);
        if (estabaQuitado) set.add(prestadorId);
        else set.delete(prestadorId);
        return set;
      });
    }
  };

  const hayMas = prestadores.length < total;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarUser />

      <main className="flex-1 container mx-auto px-4 md:px-8 pt-28 pb-16">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-8">
          <Heart size={24} className="text-red-500" fill="currentColor" />
          Mis favoritos
        </h1>

        {loading && prestadores.length === 0 ? (
          <p className="text-center text-gray-500 py-16">Cargando favoritos...</p>
        ) : prestadores.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 font-medium">
              Todavía no guardaste ningún prestador.
            </p>
            <p className="text-gray-500 mt-2">
              Tocá el corazón de una card para guardarla acá.
            </p>
            <Link
              to="/servicios"
              className="inline-block mt-6 rounded-md bg-jobit-violeta-900 px-4 py-2 text-sm text-white hover:opacity-90 transition"
            >
              Buscar servicios
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {prestadores.map((prestador) => (
                <PrestadorCard
                  key={prestador.id}
                  prestador={prestador}
                  favorito={!quitados.has(prestador.id)}
                  onToggleFavorito={() => toggleFavorito(prestador.id)}
                />
              ))}
            </div>

            {hayMas && (
              <div className="max-w-5xl mx-auto flex justify-end mt-8">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => cargar(page + 1, true)}
                  className="text-sm font-semibold text-gray-700 underline underline-offset-4 hover:text-jobit-violeta-900 transition disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Ver más"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
