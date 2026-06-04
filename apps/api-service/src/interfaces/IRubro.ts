export interface IDisponibilidad {
    dia: string[];
    desde: string;
    hasta: string;
}

export interface ISubRubro {
    nombre: string;
    zonaCobertura: string[];
    disponibilidad: IDisponibilidad[];
}

export interface IRubro {
    nombre: String;
    subrubro: ISubRubro[];
}