// Authentication controller
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { pool } from "../config/db";
import { signToken } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password) {
        return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if ((existing as any[]).length > 0) {
        return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const allowedRoles = ["admin", "operator", "viewer"];
    const finalRole = allowedRoles.includes(role) ? role : "viewer";

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
        "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)",
        [nama, email, hashed, finalRole]
    );

    res.status(201).json({ message: "Registrasi berhasil, silakan login" });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = (rows as any[])[0];

    if (!user) {
        return res.status(401).json({ message: "Email atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = signToken({ id: user.id, nama: user.nama, role: user.role });

    res.json({
        message: "Login berhasil",
        token,
        user: { id: user.id, nama: user.nama, email: user.email, role: user.role },
    });
});

// Untuk JWT stateless, logout cukup dilakukan di frontend (hapus token).
// Endpoint ini disediakan agar alur eksplisit & mudah didemokan.
export const logout = asyncHandler(async (_req: Request, res: Response) => {
    res.json({ message: "Logout berhasil, silakan hapus token di client" });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email wajib diisi" });

    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    const user = (rows as any[])[0];
    if (!user) {
        return res.status(404).json({ message: "Email tidak terdaftar" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    await pool.query(
        "UPDATE users SET reset_token = ?, reset_token_expired_at = ? WHERE id = ?",
        [token, expiredAt, user.id]
    );

    // Di aplikasi nyata, token ini dikirim via email.
    // Untuk keperluan demo, token dikembalikan langsung di response.
    res.json({ message: "Token reset password berhasil dibuat", reset_token: token });
});

export const resetPasswordByToken = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token dan password baru wajib diisi" });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const [rows] = await pool.query(
        "SELECT id FROM users WHERE reset_token = ? AND reset_token_expired_at > NOW()",
        [token]
    );
    const user = (rows as any[])[0];
    if (!user) {
        return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expired_at = NULL WHERE id = ?",
        [hashed, user.id]
    );

    res.json({ message: "Password berhasil direset, silakan login dengan password baru" });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const [rows] = await pool.query(
        "SELECT id, nama, email, role, created_at FROM users WHERE id = ?",
        [req.user!.id]
    );
    const user = (rows as any[])[0];
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ data: user });
});