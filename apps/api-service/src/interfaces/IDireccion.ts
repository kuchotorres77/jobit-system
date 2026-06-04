import { IDepartamento } from "./IDepartamento";
import { INombre } from "./INombre";
import { IPais } from "./IPais";
import { IProvincia } from "./IProvincia";

export interface IDireccion {
    tipo: String;
    valor: String;
    codigoPostal: String;
    barrio: INombre;
    localidad: INombre;
    departamento: IDepartamento;
    provincia: IProvincia;
    pais: IPais
}