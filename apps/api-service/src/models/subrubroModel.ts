import { Schema, model } from "mongoose";
import { ISubRubro } from "../interfaces/IRubro";

export const SubrubroSchema = new Schema<ISubRubro>(
    {
        nombre: { type: String, required: true }
    }
);

// export const SubrubroModel = model('rubros', SubrubroSchema);