import { useState, useEffect, useRef } from "react";
import { ChevronDown, X, Search } from "lucide-react";

interface JobitSelectProps {
  label?: string;
  options: string[];
  multiple?: boolean;
  limit?: number; // solo para multiple
  value?: string[] | string;
  placeholder?: string;
  onChange?: (val: string[] | string) => void;
}

export const JobitSelect = ({
  label = "",
  options,
  multiple = false,
  limit = 10,
  value,
  placeholder = "Selecciona...",
  onChange,
}: JobitSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : []) : []
  );

  const selectRef = useRef<HTMLDivElement | null>(null);

  // Sincroniza con el value externo (necesario para formularios con datos precargados)
  useEffect(() => {
    if (multiple) {
      setSelected(Array.isArray(value) ? value : []);
    } else {
      setSelected(typeof value === "string" && value ? [value] : []);
    }
  }, [value, multiple]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (o) => !multiple || !selected.includes(o)
  ).filter((o) => o.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (opt: string) => {
    if (multiple) {
      if (selected.length >= limit) return; 
      const updated = [...selected, opt];
      setSelected(updated);
      onChange?.(updated);
    } else {
      setSelected([opt]);
      onChange?.(opt);
      setOpen(false);
    }
    setSearch("");
  };

  const removeItem = (opt: string) => {
    const updated = selected.filter((o) => o !== opt);
    setSelected(updated);
    onChange?.(updated);
  };

  const displayValue = multiple ? "Seleccione una o varias opciones" : selected[0] ?? placeholder;

  return (
    <div className="w-full" ref={selectRef}>
      {label && (
        <label className="block mb-1 text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      {/* Contenedor visible */}
      <div
        onClick={() => setOpen(!open)}
        className={`
          flex items-center justify-between px-1 w-full rounded-md border 
          ${open ? "border-blue-500 shadow-md" : "border-gray-300"}
          bg-white cursor-pointer transition
        `}
      >
        {/* Tags o texto */}
        <div className="flex flex-wrap items-center flex-1 text-gray-800">
          {multiple && selected.length > 0 ? (
            selected.map((opt) => (
              <span
                key={opt}
                className="flex items-center gap-1 bg-blue-100 m-1 text-blue-800 px-2 py-1 rounded-lg text-sm border border-blue-300"
              >
                {opt}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(opt);
                  }}
                >
                  <X size={14} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500 p-2">
              {displayValue}
            </span>
          )}
        </div>

        {/* Flecha */}
        <ChevronDown
          size={20}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="mt-1 bg-white border border-gray-300 rounded-lg shadow-lg absolute z-50 max-h-60 overflow-auto">
          {/* Buscador */}
          <div className="flex items-center gap-2 p-2 border-b sticky top-0">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              className="flex-1 outline-none text-sm"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Opciones */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt}
                className="p-3 hover:bg-blue-100 cursor-pointer transition capitalize text-gray-800"
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-center">No hay resultados</div>
          )}
        </div>
      )}
    </div>
  );
}
