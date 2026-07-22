// Program Studi (Prodi) controller
import { Request, Response } from "express";
import { pool } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllProdi = asyncHandler(async (req: Request, res: Response) => {
    const { search = "" } = req.query;
    const [rows] = await pool.query(
        "SELECT * FROM prodi WHERE kode_prodi LIKE ? OR nama_prodi LIKE ? ORDER BY id DESC",
        [`%${search}%`, `%${search}%`]
    );
    res.json({ data: rows });
});

export const getProdiById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM prodi WHERE id = ?", [id]);
    const prodi = (rows as any[])[0];
    if (!prodi) return res.status(404).json({ message: "Prodi tidak ditemukan" });
    res.json({ data: prodi });
});

export const createProdi = asyncHandler(async (req: Request, res: Response) => {
    const { kode_prodi, nama_prodi } = req.body;
    if (!kode_prodi || !nama_prodi) {
        return res.status(400).json({ message: "Kode prodi dan nama prodi wajib diisi" });
    }

    const [existing] = await pool.query("SELECT id FROM prodi WHERE kode_prodi = ?", [kode_prodi]);
    if ((existing as any[]).length > 0) {
        return res.status(409).json({ message: "Kode prodi sudah digunakan" });
    }

    const [result]: any = await pool.query(
        "INSERT INTO prodi (kode_prodi, nama_prodi) VALUES (?, ?)",
        [kode_prodi, nama_prodi]
    );
    res.status(201).json({ message: "Prodi berhasil ditambahkan", data: { id: result.insertId } });
});

export const updateProdi = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { kode_prodi, nama_prodi } = req.body;
    if (!kode_prodi || !nama_prodi) {
        return res.status(400).json({ message: "Kode prodi dan nama prodi wajib diisi" });
    }

    const [rows] = await pool.query("SELECT id FROM prodi WHERE id = ?", [id]);
    if ((rows as any[]).length === 0) {
        return res.status(404).json({ message: "Prodi tidak ditemukan" });
    }

    await pool.query("UPDATE prodi SET kode_prodi = ?, nama_prodi = ? WHERE id = ?", [
        kode_prodi,
        nama_prodi,
        id,
    ]);
    res.json({ message: "Prodi berhasil diperbarui" });
});

export const deleteProdi = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [mhs] = await pool.query("SELECT id FROM mahasiswa WHERE prodi_id = ? LIMIT 1", [id]);
    if ((mhs as any[]).length > 0) {
        return res.status(400).json({ message: "Prodi tidak bisa dihapus karena masih memiliki data mahasiswa" });
    }

    const [result]: any = await pool.query("DELETE FROM prodi WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Prodi tidak ditemukan" });
    }
    res.json({ message: "Prodi berhasil dihapus" });
});