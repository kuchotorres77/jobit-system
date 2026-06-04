import { Request, Response, Router } from "express";
import { postPrestador, getAllPrestadores, getPrestador, deletePrestador, updatePrestador } from "../controllers/prestadorController";
import { logMiddleware } from "../middleware/log";
import { checkJwt } from "../middleware/session";

const router = Router();

/**
 * http://localhost:3001/api/prestadores [GET]
 */

// router.get("/", (req: Request, res: Response) => {
//     res.send({ data: "aqui_van_los_modelos" });
// });

router.get('/', getAllPrestadores);
router.get('/:id', logMiddleware, getPrestador);
router.post('/create', checkJwt, postPrestador);
router.put('/:id', updatePrestador);
router.delete('/:id', deletePrestador);


export { router };