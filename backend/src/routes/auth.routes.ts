// Authentication routes
import { Router } from "express";
import {
    register,
    login,
    logout,
    forgotPassword,
    resetPasswordByToken,
    getProfile,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordByToken);
router.get("/me", verifyToken, getProfile);
router.get("/profile", verifyToken, getProfile);

export default router;