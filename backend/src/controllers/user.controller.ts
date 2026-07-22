// User controller
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { search = "" } = req.query;
    const [rows] = await pool.query(
        `SELECT id, nama, email, role, created_at FROM users
     WHERE nama LIKE ? OR email LIKE ?
     ORDER BY id DESC`,
        [`%${search}%`, `%${search}%`]
    );
    res.json({ data: rows });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [rows] = await pool.query(
        "SELECT id, nama, email, role, created_at FROM users WHERE id = ?",
        [id]
    );
    const user = (rows as any[])[0];
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ data: user });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { nama, email, password, role } = req.body;
    const allowedRoles = ["admin", "operator", "viewer"];

    if (!nama || !email || !password || !role) {
        return res.status(400).json({ message: "Semua field wajib diisi" });
    }
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Role tidak valid" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if ((existing as any[]).length > 0) {
        return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result]: any = await pool.query(
        "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)",
        [nama, email, hashed, role]
    );

    res.status(201).json({ message: "User berhasil ditambahkan", data: { id: result.insertId } });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, email, role } = req.body;
    const allowedRoles = ["admin", "operator", "viewer"];

    if (!nama || !email || !role) {
        return res.status(400).json({ message: "Nama, email, dan role wajib diisi" });
    }
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Role tidak valid" });
    }

    const [rows] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if ((rows as any[]).length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ? AND id != ?", [email, id]);
    if ((existing as any[]).length > 0) {
        return res.status(409).json({ message: "Email sudah digunakan user lain" });
    }

    await pool.query("UPDATE users SET nama = ?, email = ?, role = ? WHERE id = ?", [
        nama,
        email,
        role,
        id,
    ]);
    res.json({ message: "User berhasil diperbarui" });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (req.user!.id === parseInt(id as string, 10)) {
        return res.status(400).json({ message: "Anda tidak bisa menghapus akun sendiri" });
    }

    const [result]: any = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json({ message: "User berhasil dihapus" });
});

// Reset password oleh admin -> generate password acak
export const resetPasswordByAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if ((rows as any[]).length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const newPassword = "reset" + Math.floor(1000 + Math.random() * 9000);
    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashed, id]);

    // Di aplikasi nyata, password baru dikirim via email, bukan ditampilkan di response.
    res.json({ message: "Password berhasil direset", newPassword });
});