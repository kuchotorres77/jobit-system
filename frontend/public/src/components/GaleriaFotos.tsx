import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { archivoUrl } from "@/api";

interface Archivo {
  id: string;
  fileName: string;
  createdAt: string;
}

interface Props {
  fotos: Archivo[];
  nombre: string;
}

export function GaleriaFotos({ fotos, nombre }: Props) {
  const [indice, setIndice] = useState<number | null>(null);

  useEffect(() => {
    if (indice === null) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndice(null);
      if (e.key === "ArrowRight")
        setIndice((i) => (i !== null ? Math.min(i + 1, fotos.length - 1) : null));
      if (e.key === "ArrowLeft")
        setIndice((i) => (i !== null ? Math.max(i - 1, 0) : null));
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [indice, fotos.length]);

  if (fotos.length === 0) return null;

  return (
    <>
      <div className="mb-10">
        <img
          src={archivoUrl(fotos[0].id)}
          alt={nombre}
          className="h-64 w-full rounded-xl object-cover cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => setIndice(0)}
        />
        {fotos.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {fotos.slice(1).map((foto, i) => (
              <img
                key={foto.id}
                src={archivoUrl(foto.id)}
                alt={`Foto ${i + 2}`}
                className="h-20 w-20 rounded-lg object-cover shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIndice(i + 1)}
              />
            ))}
          </div>
        )}
      </div>

      {indice !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIndice(null)}
        >
          <button
            aria-label="Cerrar"
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setIndice(null)}
          >
            <X size={28} />
          </button>

          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm select-none">
            {indice + 1} / {fotos.length}
          </span>

          {indice > 0 && (
            <button
              aria-label="Anterior"
              className="absolute left-3 md:left-6 text-white hover:text-gray-300 transition-colors p-2"
              onClick={(e) => {
                e.stopPropagation();
                setIndice(indice - 1);
              }}
            >
              <ChevronLeft size={40} />
            </button>
          )}

          <img
            src={archivoUrl(fotos[indice].id)}
            alt={`${nombre} — foto ${indice + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {indice < fotos.length - 1 && (
            <button
              aria-label="Siguiente"
              className="absolute right-3 md:right-6 text-white hover:text-gray-300 transition-colors p-2"
              onClick={(e) => {
                e.stopPropagation();
                setIndice(indice + 1);
              }}
            >
              <ChevronRight size={40} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
