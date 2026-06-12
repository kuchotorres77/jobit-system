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

export interface ContactoPrincipal {
  tipo: "telefono" | "email";
  valor: string;
}

export function contactoPrincipal(prestador: Prestador): ContactoPrincipal {
  const telefono = prestador.user.contactos?.find((c) => c.tipo === "CELULAR")
    ?? prestador.user.contactos?.[0];
  if (telefono) {
    return { tipo: "telefono", valor: telefono.valor };
  }
  return { tipo: "email", valor: prestador.user.email };
}
