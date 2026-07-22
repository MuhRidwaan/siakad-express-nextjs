// Global error handling middleware
import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({ message: `Route ${req.originalUrl} tidak ditemukan` });
};

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error("[ERROR]", err.message);
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || "Terjadi kesalahan pada server",
    });
};