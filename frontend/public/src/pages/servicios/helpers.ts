import { DiaSemana, Prestador } from "@/api";

export const DIA_LABEL: Record<DiaSemana, string> = {
  LUNES: "Lun",
  MARTES: "Mar",
  MIERCOLES: "Mié",
  JUEVES: "Jue",
  VIERNES: "Vie",
  SABADO: "Sáb",
  DOMINGO: "Dom",
  FERIADOS: "Feriados",
};

export function resumenDisponibilidad(prestador: Prestador): string | null {
  const disponibilidad = prestador.servicios.flatMap((s) => s.disponibilidades)[0];
  if (!disponibilidad) return null;

  const dias = disponibilidad.dias.map((d) => DIA_LABEL[d]).join(", ");
  return `${dias} · ${disponibilidad.desde} a ${disponibilidad.hasta} hs`;
}
