import { Schema, model } from "mongoose";
import { IRubro } from "../interfaces/IRubro";
import { SubrubroSchema } from "./subrubroModel";

export const RubroSchema = new Schema<IRubro>(
    {
        nombre: { type: String, required: true },
        subrubro: { type: [SubrubroSchema], required: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const RubroModel = model('rubros', RubroSchema);
// export default RubroModel;