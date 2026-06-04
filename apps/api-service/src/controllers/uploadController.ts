import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { RequestExt } from "../interfaces/Ireq-ext";
import { registerUpload } from "../services/storageService";
import { IStorage } from "../interfaces/IStorage";

const getFile = async (req: RequestExt, res: Response) => {
    try {
        const { user, file } = req;
        const dataToRegister: IStorage = {
            fileName: `${file?.filename}`,
            idUser: `${user?.id}`,
            path: `${file?.path}`
        };
        const response = await registerUpload(dataToRegister);
        res.send(response);
        // res.send("AQUI_DEBE_LLEGAR_FILE");
    } catch (error) {
        handleHttp(res, "ERROR_GET_BLOG");
    }
}

export { getFile };