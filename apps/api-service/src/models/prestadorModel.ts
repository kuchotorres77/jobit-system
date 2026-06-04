import { Schema, model } from "mongoose";
import { IPrestador } from "../interfaces/IPrestador";
import ServicioSchema from "./servicioModel";


const PrestadorSchema = new Schema<IPrestador>(
    {
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        documento: { type: String, required: true },
        servicios: { type: [ServicioSchema], required: false },
        descripcion: { type: String, required: false },
        zonaCobetura: { type: [String], required: false },
        disponibilidad: { type: [String], required: false },
        horarios: { type: [String], required: false },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const PrestadorModel = model('prestadores', PrestadorSchema);

export default PrestadorModel;