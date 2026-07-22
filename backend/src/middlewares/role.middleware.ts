// Role-based authorization middleware
import { Request, Response, NextFunction } from "express";

export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Anda tidak memiliki akses untuk aksi ini" });
        }
        next();
    };
};