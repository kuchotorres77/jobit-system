import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { NavbarUser, Footer } from "@/components";
import {
  agregarFavorito,
  ApiError,
  getFavoritos,
  getPrestadores,
  getRubros,
  quitarFavorito,
  Prestador,
  Rubro,
} from "@/api";
import { useSession } from "@/hooks/useSession";
import { PrestadorCard } from "./components/PrestadorCard";
import { SearchBar, SearchValues, SIN_FILTRO } from "./components/SearchBar";
import logoLetras from "@/assets/img/logo-letrasjobit.png";

const PAGE_SIZE = 12;

export default function Servicios() {
  const navigate = useNavigate();
  const sessionUser = useSession();
  const [searchParams] = useSearchParams();
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [filtros, setFiltros] = useState<SearchValues>({
    rubro: searchParams.get("rubro") ?? SIN_FILTRO,
    subrubro: searchParams.get("subrubro") ?? SIN_FILTRO,
    zona: searchParams.get("zona") ?? SIN_FILTRO,
  });

  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const buscar = async (pagina: number, valores: SearchValues, acumular = false) => {
    setLoading(true);
    try {
      const rubroActual = rubros.find((r) => r.nombre === valores.rubro);
      const subrubroId = rubroActual?.subrubros.find(
        (s) => s.nombre === valores.subrubro,
      )?.id;

      const result = await getPrestadores({
        page: pagina,
        limit: PAGE_SIZE,
        rubroId: subrubroId ? undefined : rubroActual?.id,
        subrubroId,
        zona: valores.zona || undefined,
      });

      setPrestadores((prev) => (acumular ? [...prev, ...result.data] : result.data));
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
    getRubros()
      .then(setRubros)
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Favoritos guardados del usuario logueado
  useEffect(() => {
    if (!sessionUser) {
      setFavoritos(new Set());
      return;
    }
    getFavoritos()
      .then((ids) => setFavoritos(new Set(ids)))
      .catch(() => undefined);
  }, [sessionUser?.id]);

  const toggleFavorito = async (prestadorId: string) => {
    if (!sessionUser) {
      const respuesta = await Swal.fire({
        title: "Guardá tus favoritos",
        text: "Para guardar un prestador como favorito tenés que iniciar sesión.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Ahora no",
      });
      if (respuesta.isConfirmed) {
        navigate("/login");
      }
      return;
    }

    const eraFavorito = favoritos.has(prestadorId);
    // Actualización optimista; se revierte si la API falla
    setFavoritos((prev) => {
      const set = new Set(prev);
      if (eraFavorito) set.delete(prestadorId);
      else set.add(prestadorId);
      return set;
    });
    try {
      if (eraFavorito) {
        await quitarFavorito(prestadorId);
      } else {
        await agregarFavorito(prestadorId);
      }
    } catch {
      setFavoritos((prev) => {
        const set = new Set(prev);
        if (eraFavorito) set.add(prestadorId);
        else set.delete(prestadorId);
        return set;
      });
    }
  };

  // Primera búsqueda cuando los rubros están disponibles (los filtros de URL
  // necesitan resolver nombre → id contra la lista de rubros)
  useEffect(() => {
    if (rubros.length > 0 || (!filtros.rubro && !filtros.subrubro)) {
      void buscar(1, filtros);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rubros]);

  const hayMas = prestadores.length < total;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarUser />

      <main className="flex-1 container mx-auto px-4 md:px-8 pt-28 pb-16">
        {/* Buscador */}
        <SearchBar
          rubros={rubros}
          values={filtros}
          loading={loading}
          onChange={setFiltros}
          onBuscar={() => buscar(1, filtros)}
        />

        {/* Título: logo "Jobit" en letras naranjas, como el frame Buscar-Jobit */}
        <h1 className="flex justify-center my-10">
          <img src={logoLetras} alt="Jobit" className="h-10 w-auto" />
        </h1>

        {/* Resultados */}
        {loading && prestadores.length === 0 ? (
          <p className="text-center text-gray-500 py-16">Cargando prestadores...</p>
        ) : prestadores.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 font-medium">
              No encontramos prestadores con esos filtros.
            </p>
            <p className="text-gray-500 mt-2">
              Probá con otro rubro o ampliá la zona de búsqueda.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {prestadores.map((prestador) => (
                <PrestadorCard
                  key={prestador.id}
                  prestador={prestador}
                  favorito={favoritos.has(prestador.id)}
                  onToggleFavorito={() => toggleFavorito(prestador.id)}
                />
              ))}
            </div>

            {/* Ver más */}
            {hayMas && (
              <div className="max-w-5xl mx-auto flex justify-end mt-8">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => buscar(page + 1, filtros, true)}
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
