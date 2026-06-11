import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Mail } from "lucide-react";
import { Prestador } from "@/api";
import { resumenDisponibilidad } from "../helpers";

interface PrestadorCardProps {
  prestador: Prestador;
}

export function PrestadorCard({ prestador }: PrestadorCardProps) {
  const navigate = useNavigate();
  const [favorito, setFavorito] = useState(false);

  const rubros = [...new Set(prestador.servicios.map((s) => s.subrubro.rubro.nombre))];
  const zonas = [...new Set(prestador.servicios.flatMap((s) => s.zonaCobertura))];
  const horario = resumenDisponibilidad(prestador);
  const iniciales = `${prestador.user.nombre.charAt(0)}${prestador.user.apellido.charAt(0)}`;

  return (
    <article
      onClick={() => navigate(`/servicios/${prestador.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer p-3 flex gap-3"
    >
      {/* Foto (placeholder con iniciales hasta tener galería) */}
      <div className="w-24 min-h-[7rem] rounded-lg bg-gradient-to-b from-jobit-violeta-700 to-jobit-violeta-900 flex items-center justify-center text-white text-2xl font-semibold shrink-0">
        {iniciales}
      </div>

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
              setFavorito(!favorito);
            }}
            className="text-red-500 hover:scale-110 transition shrink-0"
            aria-label="Marcar favorito"
          >
            <Heart size={18} fill={favorito ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 truncate">
          {prestador.user.nombre} {prestador.user.apellido}
        </h3>

        <p className="text-xs text-gray-500 truncate">{zonas.join("-")}</p>

        {horario && <p className="text-xs text-gray-500">{horario}</p>}

        <div className="flex items-center gap-1.5 mt-auto pt-1">
          <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
            <Mail size={12} />
          </span>
          <span className="text-xs font-semibold text-gray-800 truncate">
            {prestador.user.email}
          </span>
        </div>
      </div>
    </article>
  );
}
