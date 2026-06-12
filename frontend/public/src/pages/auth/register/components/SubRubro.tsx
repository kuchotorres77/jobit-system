import { Key, useEffect } from "react";
import {
  Box,
  IconButton,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Swal from "sweetalert2";
import { JobitSelect, JobitDiaHora } from "@/components";
interface Disponibilidad {
  dia: string[];
  desde: string;
  hasta: string;
}
interface SubRubro {
  nombre: string;
  zonaCobertura: string[];
  disponibilidad: Disponibilidad[];
}
interface SubRubroProps {
  subRubroArray: SubRubro[];
  subrubrosOptions?: string[];
  limit?: number;
  onChange: (data: SubRubro[]) => void;
}
const subRubroBase: SubRubro = {
  nombre: "",
  zonaCobertura: [],
  disponibilidad: [
    {
      dia: [],
      desde: "",
      hasta: "",
    },
  ],
};
export const SubRubroComponent = ({
  subRubroArray,
  subrubrosOptions = [],
  limit = 10,
  onChange,
}: SubRubroProps) => {
  const departamentosOpt = ["Capital", "Rawson", "Pocito", "Rivadavia", "Chimbas", "Santa Lucía"];
  const diasOpt = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
    "Feriados",
  ];

  useEffect(() => {
    if (!subRubroArray.length) {
      onChange([{ ...subRubroBase }]);
    }
  }, []);

  const agregarSubrubro = () => {
    if (subRubroArray.length >= limit) {
      Swal.fire({
        title: `No puedes seleccionar más de ${limit} Sub-Rubros.`,
        icon: "warning",
      });
      return;
    }
    onChange([...subRubroArray, { ...subRubroBase }]);
  };

  const eliminarSubrubro = (index: number) => {
    onChange(subRubroArray.filter((_: any, i: number) => i !== index));
  };

  const updateField = (index: number, field: keyof SubRubro, value: any) => {
    const copia = [...subRubroArray];
    copia[index] = { ...copia[index], [field]: value };
    onChange(copia);
  };

  return (
    <Box position="relative">
      {/* Botón agregar */}
      <IconButton
        onClick={agregarSubrubro}
        sx={{
          position: "absolute",
          top: -16,
          right: -16,
          backgroundColor: "#7c3aed",
          color: "#fff",
          padding: "8px",
          borderRadius: "6px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          zIndex: 10,
          "&:hover": {
            backgroundColor: "#6d28d9",
          },
        }}
      >
        <NoteAddIcon />
      </IconButton>
      {/* <IconButton
        onClick={agregarSubrubro}
        size="small"
        sx={{
          zIndex: 10,
          position: "absolute",
          top: -8,
          right: -8,
          backgroundColor: "#dc2626", // red-600
          color: "#fff",
          padding: "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          "&:hover": {
            backgroundColor: "#b91c1c", // red-700
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton> */}
      {subRubroArray.map((item: any, i: number) => (
        <Card
          key={i}
          sx={{
            mt: 4,
            position: "relative",
            overflow: "visible",
            boxShadow: 5,
            border: 'none',
          }}>
          <CardContent>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", sm: "repeat(6, 1fr)" }}
              gap={2}
            >
              {/* Subrubro */}
              <Box gridColumn="span 6">
                <JobitSelect
                  label="Subrubro"
                  options={subrubrosOptions}
                  value={item.nombre}
                  onChange={(v) => updateField(i, "nombre", v)}
                />
              </Box>

              {/* Zona cobertura */}
              <Box gridColumn="span 6">
                <JobitSelect
                  label="Zona de Cobertura"
                  options={departamentosOpt}
                  multiple
                  limit={3}
                  value={item.zonaCobertura}
                  onChange={(v) => updateField(i, "zonaCobertura", v)}
                />
              </Box>

              {/* Disponibilidad */}
              <Box gridColumn="span 6" sx={{ marginTop: 3 }}>
                <JobitDiaHora
                  diasOpt={diasOpt}
                  value={item.disponibilidad}
                  onChange={(v) =>
                    updateField(i, "disponibilidad", v)
                  }
                />
              </Box>
            </Box>

            {/* Eliminar (siempre debe quedar al menos un servicio) */}
            {subRubroArray.length > 1 && (
              <IconButton
                onClick={() => eliminarSubrubro(i)}
                size="small"
                sx={{
                  zIndex: 10,
                  position: "absolute",
                  top: -16,
                  right: -16,
                  backgroundColor: "#dc2626", // red-600
                  color: "#fff",
                  padding: "8px",
                  borderRadius: "6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  "&:hover": {
                    backgroundColor: "#b91c1c", // red-700
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
