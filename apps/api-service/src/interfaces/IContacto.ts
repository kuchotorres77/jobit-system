import { CONTACTO } from "../utils/constantes";

export interface IContacto {
    tipo: typeof CONTACTO;
    valor: String;
    activo: Boolean
}