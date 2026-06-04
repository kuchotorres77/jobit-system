import { IStorage } from "../interfaces/IStorage";
import StorageModel from "../models/storageModel";

const registerUpload = async ({ fileName, idUser, path }: IStorage) => {
    const responseItem = await StorageModel.create({ fileName, idUser, path });
    return responseItem;
};
export { registerUpload };