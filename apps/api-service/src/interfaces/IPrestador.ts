import { IDepartamento } from "./IDepartamento";
import { IRubro, ISubRubro } from "./IRubro";
import { IUser } from "./IUser";
import { DISPONIBILIDAD, HORARIO } from "../utils/constantes"
import { IServicio } from "./IServicio";

export interface IPrestador extends IUser {
    servicios: IServicio[];
    descripcion: String;
    zonaCobetura: IDepartamento[];
    disponibilidad: [typeof DISPONIBILIDAD];
    horarios: [typeof HORARIO]
}