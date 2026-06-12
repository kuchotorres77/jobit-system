import { useState } from "react";
import { Star } from "lucide-react";

// Color de las estrellas del frame Buscar-Jobit 2
export const COLOR_ESTRELLA = "#3484FA";

interface EstrellasProps {
  valor: number;
  size?: number;
  className?: string;
}

/** Fila de 5 estrellas de solo lectura (rellena según el valor redondeado). */
export function Estrellas({ valor, size = 14, className = "" }: EstrellasProps) {
  const relleno = Math.round(valor);
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          color={COLOR_ESTRELLA}
          fill={n <= relleno ? COLOR_ESTRELLA : "none"}
        />
      ))}
    </div>
  );
}

interface EstrellasInputProps {
  valor: number;
  onChange: (valor: number) => void;
  size?: number;
}

/** Selector de calificación de 1 a 5 estrellas. */
export function EstrellasInput({ valor, onChange, size = 24 }: EstrellasInputProps) {
  const [hover, setHover] = useState(0);
  const activo = hover || valor;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="transition hover:scale-110"
        >
          <Star
            size={size}
            color={COLOR_ESTRELLA}
            fill={n <= activo ? COLOR_ESTRELLA : "none"}
          />
        </button>
      ))}
    </div>
  );
}
