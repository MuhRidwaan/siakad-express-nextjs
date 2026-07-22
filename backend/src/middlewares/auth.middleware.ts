import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token tidak ditemukan" });
    }
    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token tidak ditemukan" });
    }
    try {
        const decoded = verifyJwt(token);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa" });
    }
};