import { Schema } from "mongoose";
import { IServicio } from "../interfaces/IServicio";

import { SubrubroSchema } from "./subrubroModel";
import { RubroSchema } from "./rubroModel";

const ServicioSchema = new Schema<IServicio>(
    {
        rubro: { type: String },
        subrubros: [
            {
                nombre: { type: String },
                zonaCobertura: [{ type: String }],
                disponibilidad: [
                    {
                        dia: [{ type: String }],
                        desde: { type: String },
                        hasta: { type: String }
                    }
                ]
            }
        ]
    }
)

export default ServicioSchema;