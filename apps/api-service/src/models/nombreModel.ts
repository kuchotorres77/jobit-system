import { Schema } from "mongoose";
import { INombre } from "../interfaces/INombre";

const NombreSchema = new Schema<INombre>(
    {
        nombre: { type: String, required: false }
    }
);