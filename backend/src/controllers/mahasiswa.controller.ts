// Mahasiswa controller
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { pool } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllMahasiswa = asyncHandler(async (req: Request, res: Response) => {
    const {
        search = "",
        prodi_id,
        angkatan,
        page = "1",
        limit = "10",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.max(parseInt(limit) || 10, 1);
    const offset = (pageNum - 1) * limitNum;

    let where = "WHERE (m.nim LIKE ? OR m.nama LIKE ?)";
    const params: any[] = [`%${search}%`, `%${search}%`];

    if (prodi_id) {
        where += " AND m.prodi_id = ?";
        params.push(prodi_id);
    }
    if (angkatan) {
        where += " AND m.angkatan LIKE ?";
        params.push(`%${angkatan}%`);
    }

    const [rows] = await pool.query(
        `SELECT m.id, m.nim, m.nama, m.prodi_id, m.angkatan, m.foto, m.created_at,
            p.kode_prodi, p.nama_prodi
     FROM mahasiswa m
     JOIN prodi p ON m.prodi_id = p.id
     ${where}
     ORDER BY m.nim DESC
     LIMIT ? OFFSET ?`,
        [...params, limitNum, offset]
    );

    const [countRows] = await pool.query(
        `SELECT COUNT(*) as total FROM mahasiswa m ${where}`,
        params
    );
    const total = (countRows as any[])[0].total;

    res.json({
        data: rows,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    });
});

export const getMahasiswaById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [rows] = await pool.query(
        `SELECT m.*, p.kode_prodi, p.nama_prodi
     FROM mahasiswa m JOIN prodi p ON m.prodi_id = p.id
     WHERE m.id = ?`,
        [id]
    );
    const mhs = (rows as any[])[0];
    if (!mhs) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    res.json({ data: mhs });
});

export const createMahasiswa = asyncHandler(async (req: Request, res: Response) => {
    const { nim, nama, prodi_id, angkatan } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!nim || !nama || !prodi_id || !angkatan) {
        return res.status(400).json({ message: "NIM, nama, prodi, dan angkatan wajib diisi" });
    }

    const [prodi] = await pool.query("SELECT id FROM prodi WHERE id = ?", [prodi_id]);
    if ((prodi as any[]).length === 0) {
        return res.status(400).json({ message: "Prodi tidak ditemukan" });
    }

    const [existing] = await pool.query("SELECT id FROM mahasiswa WHERE nim = ?", [nim]);
    if ((existing as any[]).length > 0) {
        return res.status(409).json({ message: "NIM sudah terdaftar" });
    }

    const [result]: any = await pool.query(
        "INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto) VALUES (?, ?, ?, ?, ?)",
        [nim, nama, prodi_id, angkatan, foto]
    );

    res.status(201).json({ message: "Mahasiswa berhasil ditambahkan", data: { id: result.insertId } });
});

export const updateMahasiswa = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nim, nama, prodi_id, angkatan } = req.body;

    const [rows] = await pool.query("SELECT * FROM mahasiswa WHERE id = ?", [id]);
    const existingMhs = (rows as any[])[0];
    if (!existingMhs) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });

    if (!nim || !nama || !prodi_id || !angkatan) {
        return res.status(400).json({ message: "NIM, nama, prodi, dan angkatan wajib diisi" });
    }

    // jika ada file foto baru, hapus foto lama & pakai yang baru
    let foto = existingMhs.foto;
    if (req.file) {
        if (existingMhs.foto) {
            const oldPath = path.join(__dirname, "../../uploads/mahasiswa", existingMhs.foto);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        foto = req.file.filename;
    }

    await pool.query(
        "UPDATE mahasiswa SET nim = ?, nama = ?, prodi_id = ?, angkatan = ?, foto = ? WHERE id = ?",
        [nim, nama, prodi_id, angkatan, foto, id]
    );

    res.json({ message: "Data mahasiswa berhasil diperbarui" });
});

export const deleteMahasiswa = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT foto FROM mahasiswa WHERE id = ?", [id]);
    const mhs = (rows as any[])[0];
    if (!mhs) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });

    if (mhs.foto) {
        const fotoPath = path.join(__dirname, "../../uploads/mahasiswa", mhs.foto);
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
    }

    await pool.query("DELETE FROM mahasiswa WHERE id = ?", [id]);
    res.json({ message: "Mahasiswa berhasil dihapus" });
});

export const uploadFotoMahasiswa = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!req.file) {
        return res.status(400).json({ message: "File foto wajib diunggah" });
    }

    const [rows] = await pool.query("SELECT foto FROM mahasiswa WHERE id = ?", [id]);
    const existingMhs = (rows as any[])[0];
    if (!existingMhs) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });

    if (existingMhs.foto) {
        const oldPath = path.join(__dirname, "../../uploads/mahasiswa", existingMhs.foto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await pool.query("UPDATE mahasiswa SET foto = ? WHERE id = ?", [req.file.filename, id]);
    res.json({ message: "Foto mahasiswa berhasil diunggah", foto: req.file.filename });
});