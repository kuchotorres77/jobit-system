import { IPrestador } from "../interfaces/IPrestador";
import PrestadorModel from "../models/prestadorModel";

const save = async (prestador: IPrestador) => {
    const responseInsert = await PrestadorModel.create(prestador);
    return responseInsert;
};

const findAll = async () => {
    const res = await PrestadorModel.find({});
    return res;
}

const findById = async (id: string) => {
    const res = await PrestadorModel.findById(id);
    return res;
}

const findByIdAndUpdate = async (id: string, data: IPrestador) => {
    const res = await PrestadorModel.findByIdAndUpdate(id, data, { new: true });
    return res;
}

const deleteOne = async (id: string) => {
    const res = await PrestadorModel.deleteOne({ _id: id });
    return res;
}


export {
    save,
    findAll,
    findById,
    findByIdAndUpdate,
    deleteOne
};