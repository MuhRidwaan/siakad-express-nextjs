// Mahasiswa routes
import { Router } from "express";
import {
    getAllMahasiswa,
    getMahasiswaById,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    uploadFotoMahasiswa,
} from "../controllers/mahasiswa.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", verifyToken, getAllMahasiswa);
router.get("/:id", verifyToken, getMahasiswaById);
router.post("/", verifyToken, authorize("admin", "operator"), upload.single("foto"), createMahasiswa);
router.put("/:id", verifyToken, authorize("admin", "operator"), upload.single("foto"), updateMahasiswa);
router.delete("/:id", verifyToken, authorize("admin"), deleteMahasiswa);
router.post("/:id/upload", verifyToken, authorize("admin", "operator"), upload.single("foto"), uploadFotoMahasiswa);

export default router;