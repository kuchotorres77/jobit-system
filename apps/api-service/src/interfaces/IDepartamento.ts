import { IProvincia } from "./IProvincia";

export interface IDepartamento {
    nombre: String,
    codDepartamento: String,
    provincia: IProvincia,
    activo: Boolean
}