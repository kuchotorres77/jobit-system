import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface VolverProps {
  a: string;
}

/** Link "Volver" del portal admin, con destino explícito. */
export function Volver({ a }: VolverProps) {
  return (
    <Link
      to={a}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-jobit-violeta-900 transition shrink-0"
    >
      <ArrowLeft size={16} />
      Volver
    </Link>
  );
}
