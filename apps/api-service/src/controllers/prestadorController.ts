import { Request, Response } from 'express';
// import Prestador from '../models/prestadorModel';
import { handleHttp } from '../utils/error.handle';
import { findById, findAll, save, findByIdAndUpdate, deleteOne } from '../services/prestadorServices';
import { JwtPayload } from 'jsonwebtoken';
import { RequestExt } from '../interfaces/Ireq-ext';

const getPrestador = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await findById(id);
    const data = response ? response : 'NOT_FOUND'
    res.status(200).send(
      {
        status: "success",
        data: data,
        message: "Request successful"
      }
    );
  } catch (e) {
    handleHttp(res, 'ERROR_GET_PRESTADOR: ' + e);
  }
}

const getAllPrestadores = async (req: Request, res: Response) => {
  try {
    const prestadores = await findAll();
    res.status(200).json(prestadores);
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ALL_PRESTADORES', e);
  }
}

const postPrestador = async ({ body, user }: RequestExt, res: Response) => {
  try {
    const responsePrestador = await save(body);
    res.status(201).send(
      {
        data: responsePrestador,
        user: user
      });
    // res.status(201).json(newPrestador);
  } catch (e) {
    handleHttp(res, 'ERROR_POST_PRESTADOR', e);
  }
}

const updatePrestador = async ({ params, body }: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await findByIdAndUpdate(id, body)
    res.status(201).send(
      {
        status: "success",
        data: response,
        message: "Request successful"
      }
    );
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_PRESTADOR', e);
  }
}

const deletePrestador = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await deleteOne(id);
    res.status(200).send({
      status: "success",
      data: response,
      message: "Request successful"
    });
  } catch (e) {
    handleHttp(res, 'ERROR_DELETE_PRESTADOR: ' + e);
  }
}

export { getPrestador, getAllPrestadores, postPrestador, updatePrestador, deletePrestador }


// export const getAllPrestadores = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const prestadores = await Prestador.find();
//     res.status(200).json(prestadores);
//   } catch (e) {
//     handleHttp(res, 'ERROR_GET_PRESTADORES: ' + e);
//   }
// };

// export const createPrestador = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { nombre, apellido, documento, rubros, descripcion, zonaCobetura } = req.body;
//     const newPrestador = new Prestador({ nombre, apellido, documento, rubros, descripcion, zonaCobetura });
//     await newPrestador.save();
//     res.status(201).json(newPrestador);
//   } catch (error: any) {
//     res.status(500).send(error.message);
//   }
// };

