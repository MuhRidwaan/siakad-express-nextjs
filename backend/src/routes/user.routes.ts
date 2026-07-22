// User routes
import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetPasswordByAdmin,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Semua route user CRUD khusus admin
router.get("/", verifyToken, authorize("admin"), getAllUsers);
router.get("/:id", verifyToken, authorize("admin"), getUserById);
router.post("/", verifyToken, authorize("admin"), createUser);
router.put("/:id", verifyToken, authorize("admin"), updateUser);
router.delete("/:id", verifyToken, authorize("admin"), deleteUser);
router.post("/:id/reset-password", verifyToken, authorize("admin"), resetPasswordByAdmin);

export default router;