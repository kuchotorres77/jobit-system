import { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import Swal from "sweetalert2";
import { NavbarUser, Footer } from "@/components";
import { ApiError, getPrestador, getRubros, Prestador, Rubro } from "@/api";
import { SearchBar, SearchValues, SIN_FILTRO } from "./components/SearchBar";
import { DIA_LABEL } from "./helpers";

export default function PrestadorDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [filtros, setFiltros] = useState<SearchValues>({
    rubro: SIN_FILTRO,
    subrubro: SIN_FILTRO,
    zona: SIN_FILTRO,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRubros()
      .then(setRubros)
      .catch(() => undefined);

    if (!id) return;
    getPrestador(id)
      .then(setPrestador)
      .catch((error) => {
        const message =
          error instanceof ApiError
            ? error.message
            : "No se pudo conectar con el servidor";
        Swal.fire({ title: "Error", text: message, icon: "error" }).then(() =>
          navigate("/servicios"),
        );
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const irABusqueda = () => {
    const params: Record<string, string> = {};
    if (filtros.rubro) params.rubro = filtros.rubro;
    if (filtros.subrubro) params.subrubro = filtros.subrubro;
    if (filtros.zona) params.zona = filtros.zona;
    navigate({ pathname: "/servicios", search: `?${createSearchParams(params)}` });
  };

  const rubrosDelPrestador = prestador
    ? [...new Set(prestador.servicios.map((s) => s.subrubro.rubro.nombre))]
    : [];
  const zonas = prestador
    ? [...new Set(prestador.servicios.flatMap((s) => s.zonaCobertura))]
    : [];
  const disponibilidades = prestador
    ? prestador.servicios.flatMap((s) => s.disponibilidades)
    : [];
  const iniciales = prestador
    ? `${prestador.user.nombre.charAt(0)}${prestador.user.apellido.charAt(0)}`
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarUser />

      <main className="flex-1 container mx-auto px-4 md:px-8 pt-28 pb-16">
        {/* Buscador (vuelve al listado con los filtros elegidos) */}
        <SearchBar
          rubros={rubros}
          values={filtros}
          onChange={setFiltros}
          onBuscar={irABusqueda}
        />

        {loading ? (
          <p className="text-center text-gray-500 py-24">Cargando prestador...</p>
        ) : !prestador ? null : (
          <div className="max-w-4xl mx-auto mt-12">
            {/* Volver */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-jobit-violeta-900 transition mb-4"
            >
              <ArrowLeft size={16} />
              Volver
            </button>

            {/* Título */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              {rubrosDelPrestador.join(" · ")} {prestador.user.nombre}{" "}
              {prestador.user.apellido}
            </h1>

            {/* Banner (placeholder de galería hasta que existan fotos) */}
            <div className="h-64 rounded-xl bg-gradient-to-br from-jobit-violeta-700 via-jobit-violeta-900 to-jobit-violeta-900 flex items-center justify-center mb-10">
              <span className="text-white text-7xl font-semibold opacity-80">
                {iniciales}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Descripción */}
              <div className="lg:col-span-2 space-y-5 text-sm text-gray-700 leading-relaxed">
                {prestador.descripcion && <p>{prestador.descripcion}</p>}

                {disponibilidades.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-900">Disponibilidad horaria:</p>
                    {disponibilidades.map((d) => (
                      <p key={d.id}>
                        {d.dias.map((dia) => DIA_LABEL[dia]).join(", ")} · {d.desde} a{" "}
                        {d.hasta} hs
                      </p>
                    ))}
                  </div>
                )}

                {zonas.length > 0 && (
                  <p>
                    <span className="font-semibold text-gray-900">
                      Departamentos en que ofrece su servicio:{" "}
                    </span>
                    {zonas.join(", ")}.
                  </p>
                )}

                <div>
                  <p className="font-semibold text-gray-900 mb-2">Servicios:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {prestador.servicios.map((servicio) => (
                      <span
                        key={servicio.id}
                        className="text-xs bg-purple-50 text-jobit-violeta-700 border border-purple-200 px-2.5 py-1 rounded-full"
                      >
                        {servicio.subrubro.rubro.nombre} — {servicio.subrubro.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <aside>
                <div className="bg-gray-100 rounded-xl p-5">
                  <p className="font-semibold text-gray-900 mb-3">Contacto:</p>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                      <Mail size={14} />
                    </span>
                    <span className="text-sm text-gray-800 break-all">
                      {prestador.user.email}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
