import { useEffect, useRef, useState } from "react";
import { Briefcase, ChevronDown, MapPin, Search, Wrench } from "lucide-react";
import { Rubro } from "@/api";

export interface SearchValues {
  q: string;
  rubro: string;
  subrubro: string;
  zona: string;
}

export const SIN_FILTRO = "";
export const ZONAS = ["Capital", "Rawson", "Pocito", "Rivadavia", "Chimbas", "Santa Lucía"];

interface PillSelectProps {
  icon: React.ReactNode;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function PillSelect({ icon, placeholder, options, value, onChange }: PillSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-44" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 transition"
      >
        <span className="text-gray-400">{icon}</span>
        <span
          className={`flex-1 text-left text-sm truncate ${
            value ? "text-gray-800 font-medium" : "text-gray-400"
          }`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div
            className="px-4 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              onChange(SIN_FILTRO);
              setOpen(false);
            }}
          >
            {placeholder}
          </div>
          {options.map((opt) => (
            <div
              key={opt}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SearchBarProps {
  rubros: Rubro[];
  values: SearchValues;
  loading?: boolean;
  onChange: (values: SearchValues) => void;
  onBuscar?: () => void;
}

export function SearchBar({
  rubros,
  values,
  loading = false,
  onChange,
  onBuscar,
}: SearchBarProps) {
  const rubroActual = rubros.find((r) => r.nombre === values.rubro);
  const subrubroOptions = rubroActual?.subrubros.map((s) => s.nombre) ?? [];

  return (
    <div className="flex flex-col gap-3">
      {/* Input de texto libre */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={values.q}
          onChange={(e) => onChange({ ...values, q: e.target.value })}
          placeholder="Buscar por nombre, rubro, sub-rubro o ubicación..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 hover:bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-jobit-violeta-700 rounded-lg text-sm text-gray-800 placeholder-gray-400 transition"
        />
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <PillSelect
          icon={<Briefcase size={16} />}
          placeholder="Rubro"
          options={rubros.map((r) => r.nombre)}
          value={values.rubro}
          onChange={(rubro) => onChange({ ...values, rubro, subrubro: SIN_FILTRO })}
        />
        <PillSelect
          icon={<Wrench size={16} />}
          placeholder="Sub-rubro"
          options={subrubroOptions}
          value={values.subrubro}
          onChange={(subrubro) => onChange({ ...values, subrubro })}
        />
        <PillSelect
          icon={<MapPin size={16} />}
          placeholder="Ubicación"
          options={ZONAS}
          value={values.zona}
          onChange={(zona) => onChange({ ...values, zona })}
        />

        {/* Botón explícito solo cuando el padre lo requiere (ej: PrestadorDetalle navega al listado) */}
        {onBuscar && (
          <button
            type="button"
            onClick={onBuscar}
            disabled={loading}
            className="bg-jobit-violeta-900 text-white text-sm font-medium rounded-lg px-8 py-2.5 hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        )}
      </div>
    </div>
  );
}
