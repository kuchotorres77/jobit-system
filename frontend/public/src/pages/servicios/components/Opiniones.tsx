import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ApiError,
  eliminarMiReview,
  getMiReview,
  getReviews,
  opinar,
  Prestador,
  Review,
  ReviewsResumen,
} from "@/api";
import { useSession } from "@/hooks/useSession";
import { Estrellas, EstrellasInput } from "./Estrellas";

interface OpinionesProps {
  prestador: Prestador;
  onResumen?: (resumen: ReviewsResumen) => void;
}

const PAGINA = 10;

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Opiniones({ prestador, onResumen }: OpinionesProps) {
  const navigate = useNavigate();
  const sessionUser = useSession();
  const esDuenio = sessionUser?.id === prestador.userId;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [resumen, setResumen] = useState<ReviewsResumen | null>(null);
  const [page, setPage] = useState(1);
  const [miReview, setMiReview] = useState<Review | null>(null);
  const [puntaje, setPuntaje] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(
    async (pagina: number, reemplazar: boolean) => {
      const listado = await getReviews(prestador.id, pagina, PAGINA);
      setReviews((prev) =>
        reemplazar ? listado.data : [...prev, ...listado.data],
      );
      setTotal(listado.meta.total);
      setResumen(listado.resumen);
      setPage(pagina);
      onResumen?.(listado.resumen);
    },
    [prestador.id, onResumen],
  );

  useEffect(() => {
    cargar(1, true).catch(() => undefined);

    if (sessionUser && !esDuenio) {
      getMiReview(prestador.id)
        .then((review) => {
          setMiReview(review);
          if (review) {
            setPuntaje(review.puntaje);
            setComentario(review.comentario ?? "");
          }
        })
        .catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prestador.id, sessionUser?.id]);

  const publicar = async () => {
    if (puntaje < 1) {
      Swal.fire({
        title: "Elegí una calificación",
        text: "Seleccioná de 1 a 5 estrellas.",
        icon: "warning",
      });
      return;
    }

    setEnviando(true);
    try {
      const review = await opinar(prestador.id, {
        puntaje,
        comentario: comentario.trim() || undefined,
      });
      setMiReview(review);
      await cargar(1, true);
      Swal.fire({
        title: "¡Gracias por tu opinión!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "No se pudo publicar", text: message, icon: "error" });
    } finally {
      setEnviando(false);
    }
  };

  const eliminar = async () => {
    setEnviando(true);
    try {
      await eliminarMiReview(prestador.id);
      setMiReview(null);
      setPuntaje(0);
      setComentario("");
      await cargar(1, true);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "No se pudo eliminar", text: message, icon: "error" });
    } finally {
      setEnviando(false);
    }
  };

  const distribucion = resumen?.distribucion ?? {};
  const totalResumen = resumen?.total ?? 0;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Opiniones destacadas */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-5">Opiniones destacadas</h2>

          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">
              Este prestador todavía no tiene opiniones.
            </p>
          ) : (
            <ul className="space-y-6">
              {reviews.map((review) => (
                <li key={review.id} className="border-b border-gray-100 pb-5">
                  <div className="flex items-center justify-between">
                    <Estrellas valor={review.puntaje} />
                    <span className="text-xs text-gray-500">
                      {formatearFecha(review.createdAt)}
                    </span>
                  </div>
                  {review.comentario && (
                    <p className="text-sm text-gray-900 mt-2">{review.comentario}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5">
                    {review.user.nombre} {review.user.apellido}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {reviews.length < total && (
            <button
              type="button"
              onClick={() => cargar(page + 1, false).catch(() => undefined)}
              className="mt-4 text-sm font-semibold text-jobit-violeta-700 hover:underline"
            >
              Ver más opiniones
            </button>
          )}
        </div>

        {/* Evaluación general */}
        <aside>
          <h2 className="font-semibold text-gray-900 mb-5">Evaluación general</h2>
          {totalResumen === 0 ? (
            <p className="text-sm text-gray-500">Sin evaluaciones todavía.</p>
          ) : (
            <div>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-semibold text-gray-900 leading-none">
                  {(resumen?.promedio ?? 0).toLocaleString("es-AR", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <div>
                  <Estrellas valor={resumen?.promedio ?? 0} size={16} />
                  <p className="text-xs text-gray-500 mt-1">
                    ({totalResumen} {totalResumen === 1 ? "Evaluación" : "Evaluaciones"})
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-1.5">
                {[5, 4, 3, 2, 1].map((estrellas) => {
                  const cantidad = distribucion[estrellas] ?? 0;
                  const pct = totalResumen > 0 ? Math.round((cantidad / totalResumen) * 100) : 0;
                  return (
                    <div key={estrellas} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-3 text-right">{estrellas}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3484FA] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-9">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dejar opinión */}
          <div className="mt-8 bg-gray-50 rounded-xl p-5">
            {!sessionUser ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Para dejar tu opinión tenés que iniciar sesión.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-md bg-jobit-violeta-900 px-4 py-2 text-sm text-white hover:opacity-90 transition"
                >
                  Iniciar sesión
                </button>
              </div>
            ) : esDuenio ? (
              <p className="text-sm text-gray-500 text-center">
                No podés opinar sobre tu propio perfil.
              </p>
            ) : (
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-3">
                  {miReview ? "Tu opinión" : "Dejá tu opinión"}
                </p>
                <EstrellasInput valor={puntaje} onChange={setPuntaje} />
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Contanos cómo fue tu experiencia (opcional)"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="mt-3 w-full text-sm border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:border-blue-700"
                />
                <div className="mt-3 flex items-center justify-end gap-4">
                  {miReview && (
                    <button
                      type="button"
                      onClick={eliminar}
                      disabled={enviando}
                      className="text-sm text-red-600 hover:underline disabled:opacity-60"
                    >
                      Eliminar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={publicar}
                    disabled={enviando}
                    className="rounded-md bg-orange-400 px-3 py-2 text-sm text-white disabled:opacity-60"
                  >
                    {enviando
                      ? "Enviando..."
                      : miReview
                        ? "Actualizar opinión"
                        : "Publicar opinión"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
