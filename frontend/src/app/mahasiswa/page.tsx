"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";

interface Mahasiswa {
    id: number;
    nim: string;
    nama: string;
    angkatan: number;
    foto: string | null;
    kode_prodi: string;
    nama_prodi: string;
    prodi_id: number;
}

interface Prodi {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
}

const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL;

function MahasiswaContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const alertParam = searchParams.get("alert");

    const [list, setList] = useState<Mahasiswa[]>([]);
    const [prodiList, setProdiList] = useState<Prodi[]>([]);
    const [search, setSearch] = useState("");
    const [prodiFilter, setProdiFilter] = useState("");
    const [angkatanFilter, setAngkatanFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [alertInfo, setAlertInfo] = useState<{ type: "success" | "danger"; message: string } | null>(null);
    const [detailMahasiswa, setDetailMahasiswa] = useState<Mahasiswa | null>(null);

    const canEdit = user?.role === "admin" || user?.role === "operator";
    const canDelete = user?.role === "admin";

    useEffect(() => {
        if (alertParam === "created") {
            setAlertInfo({ type: "success", message: "Data mahasiswa berhasil ditambahkan!" });
        } else if (alertParam === "updated") {
            setAlertInfo({ type: "success", message: "Data mahasiswa berhasil diperbarui!" });
        }
    }, [alertParam]);

    const fetchProdi = async () => {
        const data = await apiFetch("/prodi");
        setProdiList(data.data);
    };

    const fetchData = async () => {
        const params = new URLSearchParams({
            search,
            prodi_id: prodiFilter,
            angkatan: angkatanFilter,
            page: String(page),
            limit: "10",
        });
        const data = await apiFetch(`/mahasiswa?${params.toString()}`);
        setList(data.data);
        setTotalPages(data.pagination.totalPages || 1);
    };

    useEffect(() => {
        fetchProdi();
    }, []);

    useEffect(() => {
        fetchData();
    }, [search, prodiFilter, angkatanFilter, page]);

    const handleDelete = async (id: number, nama: string) => {
        if (!confirm(`Yakin ingin menghapus mahasiswa '${nama}'?`)) return;
        try {
            await apiFetch(`/mahasiswa/${id}`, { method: "DELETE" });
            setAlertInfo({ type: "success", message: `Data mahasiswa '${nama}' berhasil dihapus!` });
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
                        <i className="bi bi-people-fill text-primary me-2"></i>
                        Data Mahasiswa
                    </h2>
                    <p className="text-muted small mb-0">Klik NIM atau nama mahasiswa untuk melihat detail profil</p>
                </div>
                {canEdit && (
                    <Link href="/mahasiswa/form" className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm">
                        <i className="bi bi-plus-circle-fill"></i>
                        Tambah Mahasiswa
                    </Link>
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

            {/* Filter & Search Bar */}
            <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-body p-3">
                    <div className="row g-3">
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-muted border-end-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    placeholder="Cari NIM atau Nama..."
                                    value={search}
                                    onChange={(e) => {
                                        setPage(1);
                                        setSearch(e.target.value);
                                    }}
                                    className="form-control border-start-0 ps-0"
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-muted border-end-0">
                                    <i className="bi bi-journal-text"></i>
                                </span>
                                <select
                                    value={prodiFilter}
                                    onChange={(e) => {
                                        setPage(1);
                                        setProdiFilter(e.target.value);
                                    }}
                                    className="form-select border-start-0 ps-0"
                                >
                                    <option value="">Semua Program Studi</option>
                                    {prodiList.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama_prodi} ({p.kode_prodi})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-muted border-end-0">
                                    <i className="bi bi-calendar-event"></i>
                                </span>
                                <input
                                    placeholder="Tahun Angkatan"
                                    value={angkatanFilter}
                                    onChange={(e) => {
                                        setPage(1);
                                        setAngkatanFilter(e.target.value);
                                    }}
                                    className="form-control border-start-0 ps-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "80px" }} className="text-center">Foto</th>
                                <th>NIM</th>
                                <th>Nama Lengkap</th>
                                <th>Program Studi</th>
                                <th className="text-center">Angkatan</th>
                                {(canEdit || canDelete) && <th className="text-end pe-4">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Tidak ada data mahasiswa yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                list.map((m) => (
                                    <tr key={m.id}>
                                        <td className="text-center cursor-pointer" onClick={() => setDetailMahasiswa(m)}>
                                            {m.foto ? (
                                                <img
                                                    src={`${UPLOAD_URL}/mahasiswa/${m.foto}`}
                                                    className="avatar-circle shadow-sm"
                                                    alt={m.nama}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            ) : (
                                                <div
                                                    className="avatar-circle bg-primary-subtle text-primary fw-bold d-inline-flex align-items-center justify-content-center"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {m.nama.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => setDetailMahasiswa(m)}
                                                className="btn btn-link text-primary fw-bold p-0 text-decoration-none text-start"
                                            >
                                                {m.nim}
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => setDetailMahasiswa(m)}
                                                className="btn btn-link text-dark fw-bold p-0 text-decoration-none text-start"
                                            >
                                                {m.nama}
                                            </button>
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary-subtle text-secondary border">
                                                {m.nama_prodi} ({m.kode_prodi})
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge bg-light text-dark border">{m.angkatan}</span>
                                        </td>
                                        {(canEdit || canDelete) && (
                                            <td className="text-end pe-4">
                                                <div className="btn-group btn-group-sm">
                                                    {canEdit && (
                                                        <Link href={`/mahasiswa/form?id=${m.id}`} className="btn btn-outline-primary">
                                                            <i className="bi bi-pencil-square me-1"></i> Edit
                                                        </Link>
                                                    )}
                                                    {canDelete && (
                                                        <button onClick={() => handleDelete(m.id, m.nama)} className="btn btn-outline-danger">
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

                {/* Pagination */}
                <div className="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center">
                    <span className="small text-muted">
                        Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
                    </span>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage((p) => p - 1)}>
                                <i className="bi bi-chevron-left me-1"></i> Prev
                            </button>
                        </li>
                        <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage((p) => p + 1)}>
                                Next <i className="bi bi-chevron-right ms-1"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Modal Detail Mahasiswa */}
            {detailMahasiswa && (
                <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow border-0 rounded-4 overflow-hidden">
                            <div className="modal-header bg-primary text-white py-3">
                                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                                    <i className="bi bi-person-vcard-fill fs-4"></i>
                                    Detail Profil Mahasiswa
                                </h5>
                                <button type="button" onClick={() => setDetailMahasiswa(null)} className="btn-close btn-close-white" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4 text-center">
                                <div className="mb-3">
                                    {detailMahasiswa.foto ? (
                                        <img
                                            src={`${UPLOAD_URL}/mahasiswa/${detailMahasiswa.foto}`}
                                            className="rounded-circle img-thumbnail shadow-sm mb-2"
                                            style={{ width: "130px", height: "130px", objectFit: "cover" }}
                                            alt={detailMahasiswa.nama}
                                        />
                                    ) : (
                                        <div
                                            className="rounded-circle bg-primary-subtle text-primary fw-bold display-4 d-inline-flex align-items-center justify-content-center mb-2 shadow-sm mx-auto"
                                            style={{ width: "120px", height: "120px" }}
                                        >
                                            {detailMahasiswa.nama.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <h4 className="fw-bold mb-1">{detailMahasiswa.nama}</h4>
                                <span className="badge bg-primary px-3 py-2 fs-6 mb-3">NIM: {detailMahasiswa.nim}</span>

                                <div className="bg-light p-3 rounded-3 text-start border">
                                    <div className="row g-2 small">
                                        <div className="col-5 text-muted fw-semibold">Program Studi</div>
                                        <div className="col-7 fw-bold">{detailMahasiswa.nama_prodi} ({detailMahasiswa.kode_prodi})</div>

                                        <div className="col-5 text-muted fw-semibold">Tahun Angkatan</div>
                                        <div className="col-7 fw-bold">{detailMahasiswa.angkatan}</div>

                                        <div className="col-5 text-muted fw-semibold">Nama File Foto</div>
                                        <div className="col-7 text-truncate font-monospace small" title={detailMahasiswa.foto || "-"}>
                                            {detailMahasiswa.foto || <span className="text-muted fst-italic">Tanpa foto</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-top py-2">
                                <button type="button" onClick={() => setDetailMahasiswa(null)} className="btn btn-secondary px-4">
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MahasiswaPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>}>
                <MahasiswaContent />
            </Suspense>
        </ProtectedRoute>
    );
}