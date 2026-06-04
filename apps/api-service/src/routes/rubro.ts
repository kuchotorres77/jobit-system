import { Router } from "express";
import { saveRubro, allRubro, getRubroId } from "../controllers/rubroController";

const router = Router();

router.get('/', allRubro);
router.get('/:id', getRubroId);
router.post('/create', saveRubro);
export { router };