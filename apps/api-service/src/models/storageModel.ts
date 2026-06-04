import { Schema, model } from "mongoose";
import { IStorage } from "../interfaces/IStorage";

const StorageSchema = new Schema<IStorage>(
    {
        fileName: { type: String, },
        idUser: { type: String, },
        path: { type: String, },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);
const StorageModel = model("storage", StorageSchema);
export default StorageModel;