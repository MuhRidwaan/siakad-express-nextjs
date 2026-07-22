"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../lib/api";

export default function RegisterPage() {
    const [form, setForm] = useState({ nama: "", email: "", password: "", role: "viewer" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify(form),
            });
            setSuccess("Registrasi berhasil! Mengarahkan ke halaman login...");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center flex-grow-1">
            <div className="card shadow border-0 rounded-4 p-4" style={{ maxWidth: "440px", width: "100%" }}>
                <div className="text-center mb-4">
                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: "56px", height: "56px" }}>
                        <i className="bi bi-person-plus-fill fs-3"></i>
                    </div>
                    <h3 className="fw-bold mb-1">Buat Akun Baru</h3>
                    <p className="text-muted small">Daftar pengguna Sistem Informasi Akademik</p>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center py-2 px-3 small" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                        <div>{error}</div>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success d-flex align-items-center py-2 px-3 small" role="alert">
                        <i className="bi bi-check-circle-fill me-2 fs-6"></i>
                        <div>{success}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted">Nama Lengkap</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <i className="bi bi-person"></i>
                            </span>
                            <input
                                name="nama"
                                type="text"
                                placeholder="Nama Lengkap"
                                value={form.nama}
                                onChange={handleChange}
                                className="form-control border-start-0 ps-0"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted">Alamat Email</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <input
                                name="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={form.email}
                                onChange={handleChange}
                                className="form-control border-start-0 ps-0"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted">Kata Sandi</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input
                                name="password"
                                type="password"
                                placeholder="Minimal 6 karakter"
                                value={form.password}
                                onChange={handleChange}
                                className="form-control border-start-0 ps-0"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-semibold text-muted">Peran (Role)</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <i className="bi bi-shield-check"></i>
                            </span>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="form-select border-start-0 ps-0"
                            >
                                <option value="viewer">Viewer (Lihat Data)</option>
                                <option value="operator">Operator (Tambah & Edit Data)</option>
                                <option value="admin">Admin (Akses Penuh)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-success w-100 py-2 fw-semibold d-flex justify-content-center align-items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Memproses...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg"></i>
                                Daftar Sekarang
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-4 pt-2 border-top">
                    <p className="small text-muted mb-0">
                        Sudah memiliki akun?{" "}
                        <Link href="/login" className="text-success fw-semibold text-decoration-none">
                            Masuk di Sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}