import { IAuth } from "./IAuth";
import { IContacto } from "./IContacto";
import { IDireccion } from "./IDireccion";

export interface IUser extends IAuth {
    nombre: String;
    apellido: String;
    documento: String;
    direccion: IDireccion[];
    contacto: IContacto[]
};