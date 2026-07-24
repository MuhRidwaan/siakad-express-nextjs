"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";

interface Prodi {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
}

function ProdiContent() {
    const { user } = useAuth();
    const [list, setList] = useState<Prodi[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({ id: 0, kode_prodi: "", nama_prodi: "" });
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [alertInfo, setAlertInfo] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const canEdit = user?.role === "admin" || user?.role === "operator";
    const canDelete = user?.role === "admin";

    const fetchData = async () => {
        const data = await apiFetch(`/prodi?search=${search}`);
        setList(data.data);
    };

    useEffect(() => {
        fetchData();
    }, [search]);

    const openAdd = () => {
        setForm({ id: 0, kode_prodi: "", nama_prodi: "" });
        setShowForm(true);
        setError("");
    };

    const openEdit = (p: Prodi) => {
        setForm(p);
        setShowForm(true);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (form.id) {
                await apiFetch(`/prodi/${form.id}`, {
                    method: "PUT",
                    body: JSON.stringify({ kode_prodi: form.kode_prodi, nama_prodi: form.nama_prodi }),
                });
                setAlertInfo({ type: "success", message: `Program Studi '${form.nama_prodi}' berhasil diperbarui!` });
            } else {
                await apiFetch("/prodi", {
                    method: "POST",
                    body: JSON.stringify({ kode_prodi: form.kode_prodi, nama_prodi: form.nama_prodi }),
                });
                setAlertInfo({ type: "success", message: `Program Studi '${form.nama_prodi}' berhasil ditambahkan!` });
            }
            setShowForm(false);
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: number, nama: string) => {
        if (!confirm(`Yakin ingin menghapus prodi '${nama}'?`)) return;
        try {
            await apiFetch(`/prodi/${id}`, { method: "DELETE" });
            setAlertInfo({ type: "success", message: `Program Studi '${nama}' berhasil dihapus!` });
            fetchData();
        } catch (err: any) {
            setAlertInfo({ type: "danger", message: err.message });
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        <i className="bi bi-journal-bookmark-fill text-primary me-2"></i>
                        Data Program Studi
                    </h2>
                    <p className="text-muted small mb-0">Kelola daftar program studi fakultas</p>
                </div>
                {canEdit && (
                    <button onClick={openAdd} className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold">
                        <i className="bi bi-plus-circle-fill"></i>
                        Tambah Prodi
                    </button>
                )}
            </div>

            {/* Notification Alert */}
            {alertInfo && (
                <div className={`alert alert-${alertInfo.type} alert-dismissible fade show d-flex align-items-center shadow-sm mb-4`} role="alert">
                    <i className={`bi ${alertInfo.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} fs-5 me-2`}></i>
                    <div>{alertInfo.message}</div>
                    <button type="button" className="btn-close" onClick={() => setAlertInfo(null)} aria-label="Close"></button>
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
                            placeholder="Cari kode atau nama prodi..."
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
                                <th style={{ width: "140px" }}>Kode Prodi</th>
                                <th>Nama Program Studi</th>
                                {(canEdit || canDelete) && <th className="text-end pe-4">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Tidak ada data program studi.
                                    </td>
                                </tr>
                            ) : (
                                list.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6">
                                                {p.kode_prodi}
                                            </span>
                                        </td>
                                        <td className="fw-bold">{p.nama_prodi}</td>
                                        {(canEdit || canDelete) && (
                                            <td className="text-end pe-4">
                                                <div className="btn-group btn-group-sm">
                                                    {canEdit && (
                                                        <button onClick={() => openEdit(p)} className="btn btn-outline-primary">
                                                            <i className="bi bi-pencil-square me-1"></i> Edit
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button onClick={() => handleDelete(p.id, p.nama_prodi)} className="btn btn-outline-danger">
                                                            <i className="bi bi-trash me-1"></i> Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {showForm && (
                <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow border-0 rounded-4">
                            <div className="modal-header bg-white border-bottom py-3">
                                <h5 className="modal-title fw-bold text-primary d-flex align-items-center gap-2">
                                    <i className={`bi ${form.id ? "bi-pencil-square" : "bi-plus-circle-fill"}`}></i>
                                    {form.id ? "Edit Program Studi" : "Tambah Program Studi Baru"}
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
                                        <label className="form-label small fw-semibold text-muted">Kode Program Studi</label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: IF, SI, TI"
                                            value={form.kode_prodi}
                                            onChange={(e) => setForm({ ...form, kode_prodi: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-muted">Nama Program Studi</label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Teknik Informatika"
                                            value={form.nama_prodi}
                                            onChange={(e) => setForm({ ...form, nama_prodi: e.target.value })}
                                            className="form-control"
                                            required
                                        />
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

export default function ProdiPage() {
    return (
        <ProtectedRoute>
            <ProdiContent />
        </ProtectedRoute>
    );
}