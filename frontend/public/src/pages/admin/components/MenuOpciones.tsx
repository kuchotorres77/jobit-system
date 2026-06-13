import { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface OpcionMenu {
  titulo: string;
  descripcion: string;
  to: string;
  icono: ReactNode;
}

interface MenuOpcionesProps {
  titulo: string;
  opciones: OpcionMenu[];
}

/** Grilla de tarjetas de navegación de los menús del portal admin. */
export function MenuOpciones({ titulo, opciones }: MenuOpcionesProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-10">
        {titulo}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {opciones.map((opcion) => (
          <Link
            key={opcion.to}
            to={opcion.to}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition p-8 flex flex-col items-center text-center gap-3 border border-gray-100"
          >
            <span className="w-16 h-16 rounded-full bg-gradient-to-b from-jobit-violeta-700 to-jobit-violeta-900 text-white flex items-center justify-center group-hover:scale-105 transition">
              {opcion.icono}
            </span>
            <span className="font-semibold text-gray-900 text-lg">
              {opcion.titulo}
            </span>
            <span className="text-sm text-gray-500">{opcion.descripcion}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
