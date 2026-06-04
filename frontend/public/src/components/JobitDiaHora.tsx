import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { JobitSelect } from "./JobitSelect";
import { JobitInputControlado } from "./JobitInputControlado";

interface Disponibilidad {
  dia: string[];
  desde: string;
  hasta: string;
}

interface JobitDiaHoraProps {
  diasOpt: string[];
  value?: Disponibilidad[];
  limit?: number;
  onChange?: (val: Disponibilidad[]) => void;
}

export const JobitDiaHora = ({
  diasOpt,
  value = [],
  limit = 10,
  onChange,
}: JobitDiaHoraProps) => {
  const [items, setItems] = useState<Disponibilidad[]>(
    value.length > 0
      ? value
      : [{ dia: [], desde: "", hasta: "" }]
  );

  const emitChange = (updated: Disponibilidad[]) => {
    setItems(updated);
    onChange?.(updated);
  };

  const agregarItem = () => {
    if (items.length >= limit) return;

    emitChange([
      ...items,
      { dia: [], desde: "", hasta: "" },
    ]);
  };

  const eliminarItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    emitChange(updated);
  };

  const updateItem = (
    index: number,
    key: keyof Disponibilidad,
    value: any
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    emitChange(updated);
  };

  return (
    <div className="rounded-md border-2 p-3 relative">
      <label className="block text-sm font-medium text-gray-900">
        Disponibilidad
      </label>

      {/* Botón agregar */}
      <button
        type="button"
        onClick={agregarItem}
        className="absolute -top-4 -right-4 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md shadow"
      >
        <Plus size={18} />
      </button>

      {/* Items */}
      {items.map((item, i) => (
        <div key={i} className="relative mt-6">
          <div className="border rounded-md p-4 shadow-md grid grid-cols-1 sm:grid-cols-6 gap-4">
            {/* Día */}
            <div className="sm:col-span-2">
              <JobitSelect
                label="Día"
                options={diasOpt}
                multiple
                value={item.dia}
                onChange={(val) =>
                  updateItem(i, "dia", val as string[])
                }
              />
            </div>

            {/* Desde */}
            <div className="sm:col-span-2">
              <JobitInputControlado
                label="Desde"
                type="time"
                value={item.desde}
                onChange={(e) =>
                  updateItem(i, "desde", e.target.value)
                }
              />
            </div>

            {/* Hasta */}
            <div className="sm:col-span-2">
              <JobitInputControlado
                label="Hasta"
                type="time"
                value={item.hasta}
                onChange={(e) =>
                  updateItem(i, "hasta", e.target.value)
                }
              />
            </div>
          </div>

          {/* Eliminar */}
          {i > 0 && (
            <button
              type="button"
              onClick={() => eliminarItem(i)}
              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
