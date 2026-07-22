"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { apiFetch } from "../../../lib/api";

interface Prodi {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
}

function MahasiswaFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const isEdit = Boolean(id);

    const [prodiList, setProdiList] = useState<Prodi[]>([]);
    const [form, setForm] = useState({ nim: "", nama: "", prodi_id: "", angkatan: "" });
    const [foto, setFoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiFetch("/prodi").then((data) => setProdiList(data.data));

        if (isEdit) {
            apiFetch(`/mahasiswa/${id}`).then((data) => {
                setForm({
                    nim: data.data.nim,
                    nama: data.data.nama,
                    prodi_id: String(data.data.prodi_id),
                    angkatan: String(data.data.angkatan),
                });
                if (data.data.foto) {
                    setPreview(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/mahasiswa/${data.data.foto}`);
                }
            });
        }
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData();
        formData.append("nim", form.nim);
        formData.append("nama", form.nama);
        formData.append("prodi_id", form.prodi_id);
        formData.append("angkatan", form.angkatan);
        if (foto) formData.append("foto", foto);

        try {
            if (isEdit) {
                await apiFetch(`/mahasiswa/${id}`, { method: "PUT", body: formData });
            } else {
                await apiFetch("/mahasiswa", { method: "POST", body: formData });
            }
            router.push("/mahasiswa");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: "600px" }}>
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
                        <i className={`bi ${isEdit ? "bi-pencil-square" : "bi-person-plus-fill"}`}></i>
                        {isEdit ? "Edit Data Mahasiswa" : "Tambah Mahasiswa Baru"}
                    </h5>
                    <button type="button" onClick={() => router.push("/mahasiswa")} className="btn-close" aria-label="Close"></button>
                </div>
                <div className="card-body p-4">
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center py-2 px-3 small mb-3" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted">NIM (Nomor Induk Mahasiswa)</label>
                            <input
                                type="text"
                                placeholder="Contoh: 202401001"
                                value={form.nim}
                                onChange={(e) => setForm({ ...form, nim: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div>

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

                        <div className="row g-3 mb-3">
                            <div className="col-md-7">
                                <label className="form-label small fw-semibold text-muted">Program Studi</label>
                                <select
                                    value={form.prodi_id}
                                    onChange={(e) => setForm({ ...form, prodi_id: e.target.value })}
                                    className="form-select"
                                    required
                                >
                                    <option value="">-- Pilih Program Studi --</option>
                                    {prodiList.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama_prodi} ({p.kode_prodi})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-5">
                                <label className="form-label small fw-semibold text-muted">Tahun Angkatan</label>
                                <input
                                    type="number"
                                    placeholder="Contoh: 2024"
                                    value={form.angkatan}
                                    onChange={(e) => setForm({ ...form, angkatan: e.target.value })}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-semibold text-muted">Foto Profil Mahasiswa</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mb-2" />
                            {preview && (
                                <div className="mt-2 text-center bg-light p-3 rounded border">
                                    <p className="small text-muted mb-2">Pratinjau Foto:</p>
                                    <img src={preview} className="img-thumbnail rounded-circle" style={{ width: "100px", height: "100px", objectFit: "cover" }} alt="preview" />
                                </div>
                            )}
                        </div>

                        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                            <button type="button" onClick={() => router.push("/mahasiswa")} className="btn btn-light border px-4">
                                Batal
                            </button>
                            <button type="submit" disabled={loading} className="btn btn-primary px-4 d-flex align-items-center gap-2">
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-floppy-fill"></i>
                                        Simpan Data
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function MahasiswaFormPage() {
    return (
        <ProtectedRoute allowedRoles={["admin", "operator"]}>
            <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>}>
                <MahasiswaFormContent />
            </Suspense>
        </ProtectedRoute>
    );
}