import { IAuth } from "../interfaces/IAuth";
import { IUser } from "../interfaces/IUser";
import UserModel from "../models/userModel";
import { encrypt, verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";

const registerNewUser = async ({ email, password, nombre, apellido, documento }: IUser) => {
    const checkIs = await UserModel.findOne({ email });
    if (checkIs) return "ALREADY_USER";
    const passHash = await encrypt(password);
    const registerNewUser = await UserModel.create({ email, password: passHash, nombre, apellido, documento });
    return registerNewUser;
};

const loginUser = async ({ email, password }: IAuth) => {
    const checkIs = await UserModel.findOne({ email });
    if (!checkIs) return "NOT_FOUND_USER";
    const passwordHash = checkIs.password;
    const isCorrect = await verified(password, passwordHash);
    if (!isCorrect) return "PASSWORD_INCORRECT";
    const token = generateToken(checkIs.email);
    const user = {
        id: checkIs.id,
        nombre: checkIs.nombre,
        apellido: checkIs.apellido,
        documento: checkIs.documento,
    }
    const data = {
        token,
        user,
        // user: checkIs,
    };
    return data;
};

export { registerNewUser, loginUser };