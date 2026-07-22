// Program Studi (Prodi) routes
import { Router } from "express";
import {
    getAllProdi,
    getProdiById,
    createProdi,
    updateProdi,
    deleteProdi,
} from "../controllers/prodi.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get("/", verifyToken, getAllProdi);
router.get("/:id", verifyToken, getProdiById);
router.post("/", verifyToken, authorize("admin", "operator"), createProdi);
router.put("/:id", verifyToken, authorize("admin", "operator"), updateProdi);
router.delete("/:id", verifyToken, authorize("admin"), deleteProdi);

export default router;