import { IRubro } from "../interfaces/IRubro";
import { RubroModel } from "../models/rubroModel"

const save = async (rubro: IRubro) => {
    const responseInsert = await RubroModel.create(rubro);
    return responseInsert;
}

const findAll = async () => {
    const res = await RubroModel.find({});
    return res;
}
const findById = async (id: string) => {
    const res = await RubroModel.findById(id);
    return res;
}
const findSubrubroById = async (id: string) => {
    // const res = await SubrubroModel.findById(id);
}
export { save, findAll, findById } 