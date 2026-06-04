import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { save, findAll, findById } from "../services/rubroServices";

const getRubroId = async ({ params }: Request, res: Response) => {
    try {
        const { id } = params;
        const rubro = await findById(id);
        const data = rubro ? rubro : 'NOT_FOUND';
        res.status(200).send(
            {
                status: "success",
                data,
                message: "Request successful"
            }
        );
    } catch (error) {
        handleHttp(res, 'ERROR_GET_RUBRO: ', error)
    }
}
const allRubro = async (req: Request, res: Response) => {
    try {
        const rubros = await findAll();
        res.status(200).json(rubros);
    } catch (e) {
        handleHttp(res, 'ERROR_GET_ALL_RUBROS', e);
    }
}
const saveRubro = async ({ body }: Request, res: Response) => {
    try {
        const responserRubro = await save(body);
        res.status(201).send({ data: responserRubro, });
    } catch (e) {
        handleHttp(res, 'ERROR_POST_RUBRO', e);
    }
}
const getSubrubroId = async ({params}: Request, res: Response)=>{
    try {
        
    } catch (error) {
        
    }
}
export { saveRubro, allRubro, getRubroId }