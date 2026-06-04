import { Schema, model, Model } from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new Schema<IUser>(
    {
        nombre: {
            required: true,
            type: String,
        },
        apellido: {
            required: true,
            type: String,
        },
        documento: {
            required: true,
            type: String,
        },
        password: {
            required: true,
            type: String,
        },
        email: {
            required: true,
            type: String,
            unique: true
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const UserModel = model('userAuth', UserSchema);
export default UserModel;