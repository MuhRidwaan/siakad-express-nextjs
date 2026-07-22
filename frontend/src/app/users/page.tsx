"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiFetch } from "../../lib/api";

interface UserRow {
    id: number;
    nama: string;
    email: string;
    role: string;
}

function UsersContent() {
    const [list, setList] = useState<UserRow[]>([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ id: 0, nama: "", email: "", password: "", role: "viewer" });
    const [error, setError] = useState("");
    const [resetInfo, setResetInfo] = useState("");

    const fetchData = async () => {
        const data = await apiFetch(`/users?search=${search}`);
        setList(data.data);
    };

    useEffect(() => {
        fetchData();
    }, [search]);

    const openAdd = () => {
        setForm({ id: 0, nama: "", email: "", password: "", role: "viewer" });
        setShowForm(true);
        setError("");
    };

    const openEdit = (u: UserRow) => {
        setForm({ id: u.id, nama: u.nama, email: u.email, password: "", role: u.role });
        setShowForm(true);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (form.id) {
                await apiFetch(`/users/${form.id}`, {
                    method: "PUT",
                    body: JSON.stringify({ nama: form.nama, email: form.email, role: form.role }),
                });
            } else {
                await apiFetch("/users", {
                    method: "POST",
                    body: JSON.stringify(form),
                });
            }
            setShowForm(false);
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus user ini?")) return;
        try {
            await apiFetch(`/users/${id}`, { method: "DELETE" });
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleReset = async (id: number) => {
        if (!confirm("Reset password user ini menjadi password acak?")) return;
        try {
            const data = await apiFetch(`/users/${id}/reset-password`, { method: "POST" });
            setResetInfo(`Password baru untuk user: ${data.newPassword}`);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <span className="badge bg-danger text-uppercase px-3 py-2">Admin</span>;
            case "operator":
                return <span className="badge bg-primary text-uppercase px-3 py-2">Operator</span>;
            default:
                return <span className="badge bg-secondary text-uppercase px-3 py-2">Viewer</span>;
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        <i className="bi bi-shield-lock-fill text-primary me-2"></i>
                        Manajemen User
                    </h2>
                    <p className="text-muted small mb-0">Kelola kredensial dan hak akses akun pengguna sistem</p>
                </div>
                <button onClick={openAdd} className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold">
                    <i className="bi bi-person-plus-fill"></i>
                    Tambah User
                </button>
            </div>

            {/* Alert Reset Info */}
            {resetInfo && (
                <div className="alert alert-warning alert-dismissible fade show d-flex align-items-center shadow-sm" role="alert">
                    <i className="bi bi-key-fill fs-5 me-2 text-warning-emphasis"></i>
                    <div>
                        <strong>Reset Password Berhasil!</strong> {resetInfo}
                    </div>
                    <button type="button" className="btn-close" onClick={() => setResetInfo("")} aria-label="Close"></button>
                </div>
            )}

            {/* Search Bar */}
            <div className="card shadow-sm border-0 rounded-3 mb-4" style={{ maxWidth: "450px" }}>
                <div className="card-body p-2">
                    <div className="input-group">
                        <span className="input-group-text bg-light text-muted border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-control border-start-0 ps-0"
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Nama Lengkap</th>
                                <th>Alamat Email</th>
                                <th>Role Hak Akses</th>
                                <th className="text-end pe-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Tidak ada data pengguna.
                                    </td>
                                </tr>
                            ) : (
                                list.map((u) => (
                                    <tr key={u.id}>
                                        <td className="fw-bold">{u.nama}</td>
                                        <td className="text-muted">{u.email}</td>
                                        <td>{getRoleBadge(u.role)}</td>
                                        <td className="text-end pe-4">
                                            <div className="btn-group btn-group-sm">
                                                <button onClick={() => openEdit(u)} className="btn btn-outline-primary">
                                                    <i className="bi bi-pencil-square me-1"></i> Edit
                                                </button>
                                                <button onClick={() => handleReset(u.id)} className="btn btn-outline-warning text-dark">
                                                    <i className="bi bi-key me-1"></i> Reset Password
                                                </button>
                                                <button onClick={() => handleDelete(u.id)} className="btn btn-outline-danger">
                                                    <i className="bi bi-trash me-1"></i> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form Overlay */}
            {showForm && (
                <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow border-0 rounded-4">
                            <div className="modal-header bg-white border-bottom py-3">
                                <h5 className="modal-title fw-bold text-primary d-flex align-items-center gap-2">
                                    <i className={`bi ${form.id ? "bi-pencil-square" : "bi-person-plus-fill"}`}></i>
                                    {form.id ? "Edit User" : "Tambah User Baru"}
                                </h5>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-close" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    {error && (
                                        <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-muted">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            placeholder="Masukkan nama lengkap"
                                            value={form.nama}
                                            onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-muted">Alamat Email</label>
                                        <input
                                            type="email"
                                            placeholder="nama@email.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    {!form.id && (
                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold text-muted">Kata Sandi</label>
                                            <input
                                                type="password"
                                                placeholder="Minimal 6 karakter"
                                                value={form.password}
                                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-muted">Role (Hak Akses)</label>
                                        <select
                                            value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                                            className="form-select"
                                        >
                                            <option value="viewer">Viewer (Hanya Melihat Data)</option>
                                            <option value="operator">Operator (Tambah & Edit Data)</option>
                                            <option value="admin">Admin (Akses Penuh)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light border-top py-2">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn btn-light border px-3">
                                        Batal
                                    </button>
                                    <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2">
                                        <i className="bi bi-floppy-fill"></i>
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function UsersPage() {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <UsersContent />
        </ProtectedRoute>
    );
}