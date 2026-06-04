import { IRubro, ISubRubro } from "./IRubro";

export interface IServicio {
    // rubro: IRubro;
    rubro: string;
    subrubros: ISubRubro[];
}