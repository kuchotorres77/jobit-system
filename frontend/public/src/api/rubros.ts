import { api } from "./client";
import { Rubro } from "./types";

export function getRubros(): Promise<Rubro[]> {
  return api.get<Rubro[]>("/rubros");
}
