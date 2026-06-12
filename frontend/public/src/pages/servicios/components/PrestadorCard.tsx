import { useNavigate } from "react-router-dom";
import { Heart, Mail, Phone, Star } from "lucide-react";
import { archivoUrl, Prestador } from "@/api";
import { contactoPrincipal, resumenDisponibilidad } from "../helpers";

interface PrestadorCardProps {
  prestador: Prestador;
  favorito: boolean;
  onToggleFavorito: () => void;
}

export function PrestadorCard({
  prestador,
  favorito,
  onToggleFavorito,
}: PrestadorCardProps) {
  const navigate = useNavigate();

  const rubros = [...new Set(prestador.servicios.map((s) => s.subrubro.rubro.nombre))];
  const zonas = [...new Set(prestador.servicios.flatMap((s) => s.zonaCobertura))];
  const horario = resumenDisponibilidad(prestador);
  const iniciales = `${prestador.user.nombre.charAt(0)}${prestador.user.apellido.charAt(0)}`;
  const contacto = contactoPrincipal(prestador);
  const foto = prestador.user.archivos?.[0];
  const rating = prestador.rating;

  return (
    <article
      onClick={() => navigate(`/servicios/${prestador.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer p-3 flex gap-3"
    >
      {/* Foto del prestador, o iniciales si todavía no subió ninguna */}
      {foto ? (
        <img
          src={archivoUrl(foto.id)}
          alt={`${prestador.user.nombre} ${prestador.user.apellido}`}
          className="w-24 min-h-[7rem] rounded-lg object-cover shrink-0"
        />
      ) : (
        <div className="w-24 min-h-[7rem] rounded-lg bg-gradient-to-b from-jobit-violeta-700 to-jobit-violeta-900 flex items-center justify-center text-white text-2xl font-semibold shrink-0">
          {iniciales}
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wide uppercase text-jobit-violeta-900">
            {rubros.join(" · ")}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorito();
            }}
            className="text-red-500 hover:scale-110 transition shrink-0"
            aria-label={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Heart size={18} fill={favorito ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 truncate">
          {prestador.user.nombre} {prestador.user.apellido}
        </h3>

        <p className="text-xs text-gray-500 truncate">{zonas.join("-")}</p>

        {horario && <p className="text-xs text-gray-500">{horario}</p>}

        {/* Contacto + calificación, como el frame Buscar-Jobit */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
              {contacto.tipo === "telefono" ? <Phone size={12} /> : <Mail size={12} />}
            </span>
            <span className="text-xs font-semibold text-gray-800 truncate">
              {contacto.valor}
            </span>
          </div>
          {rating && rating.total > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-900 shrink-0">
              {rating.promedio.toLocaleString("es-AR")}
              <Star size={14} color="#FFC54D" fill="#FFC54D" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
