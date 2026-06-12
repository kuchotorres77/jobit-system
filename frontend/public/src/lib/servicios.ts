import { DiaSemana, Prestador, ServicioPayload } from "@/api";

export interface DisponibilidadForm {
  dia: string[];
  desde: string;
  hasta: string;
}

export interface ServicioForm {
  nombre: string;
  zonaCobertura: string[];
  disponibilidad: DisponibilidadForm[];
}

export const DIA_API: Record<string, DiaSemana> = {
  Lunes: "LUNES",
  Martes: "MARTES",
  Miércoles: "MIERCOLES",
  Jueves: "JUEVES",
  Viernes: "VIERNES",
  Sábado: "SABADO",
  Domingo: "DOMINGO",
  Feriados: "FERIADOS",
};

const DIA_FORM: Record<DiaSemana, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
  FERIADOS: "Feriados",
};

export const normalizarDia = (dia: string): DiaSemana =>
  DIA_API[dia] ?? (dia.toUpperCase() as DiaSemana);

/**
 * Convierte los items del formulario (etiquetas "Rubro — Subrubro") al payload
 * de la API. Devuelve null si algún servicio elegido está incompleto.
 */
export function construirServicios(
  items: ServicioForm[],
  subrubroIdPorEtiqueta: Map<string, string>,
): ServicioPayload[] | null {
  const servicios: ServicioPayload[] = [];

  for (const item of items) {
    if (!item.nombre) continue;

    const subrubroId = subrubroIdPorEtiqueta.get(item.nombre);
    if (!subrubroId) continue;

    const disponibilidades = item.disponibilidad
      .filter((d) => d.dia.length > 0 && d.desde && d.hasta)
      .map((d) => ({
        dias: d.dia.map(normalizarDia),
        desde: d.desde,
        hasta: d.hasta,
      }));

    if (item.zonaCobertura.length === 0 || disponibilidades.length === 0) {
      return null;
    }

    servicios.push({
      subrubroId,
      zonaCobertura: item.zonaCobertura,
      disponibilidades,
    });
  }

  return servicios.length > 0 ? servicios : null;
}

/** Mapea los servicios de un prestador al shape editable del formulario. */
export function serviciosAFormulario(prestador: Prestador): ServicioForm[] {
  return prestador.servicios.map((servicio) => ({
    nombre: `${servicio.subrubro.rubro.nombre} — ${servicio.subrubro.nombre}`,
    zonaCobertura: servicio.zonaCobertura,
    disponibilidad: servicio.disponibilidades.map((d) => ({
      dia: d.dias.map((dia) => DIA_FORM[dia]),
      desde: d.desde,
      hasta: d.hasta,
    })),
  }));
}
