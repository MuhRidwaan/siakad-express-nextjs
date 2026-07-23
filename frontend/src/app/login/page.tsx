"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.push("/mahasiswa");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const setQuickAccount = (selectedEmail: string) => {
        setEmail(selectedEmail);
        setPassword("password");
        setError("");
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center flex-grow-1">
            <div className="card shadow border-0 rounded-4 p-4" style={{ maxWidth: "440px", width: "100%" }}>
                <div className="text-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: "56px", height: "56px" }}>
                        <i className="bi bi-mortarboard-fill fs-3"></i>
                    </div>
                    <h3 className="fw-bold mb-1">Masuk ke SIAKAD</h3>
                    <p className="text-muted small">Sistem Informasi Akademik</p>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center py-2 px-3 small mb-3" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                        <div>{error}</div>
                    </div>
                )}

                {/* Quick Account Selector */}
                <div className="bg-light p-3 rounded-3 mb-4 border">
                    <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-person-badge text-primary me-2"></i>
                        <span className="small fw-bold text-dark">Pilih Akun Demo (Default):</span>
                    </div>
                    <div className="d-flex gap-1 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setQuickAccount("admin@gmail.com")}
                            className={`btn btn-sm ${email === "admin@gmail.com" ? "btn-danger" : "btn-outline-danger"} flex-fill`}
                        >
                            Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setQuickAccount("operator@gmail.com")}
                            className={`btn btn-sm ${email === "operator@gmail.com" ? "btn-primary" : "btn-outline-primary"} flex-fill`}
                        >
                            Operator
                        </button>
                        <button
                            type="button"
                            onClick={() => setQuickAccount("viewer@gmail.com")}
                            className={`btn btn-sm ${email === "viewer@gmail.com" ? "btn-secondary" : "btn-outline-secondary"} flex-fill`}
                        >
                            Viewer
                        </button>
                    </div>
                    <div className="text-muted text-center mt-2 style-italic" style={{ fontSize: "0.75rem" }}>
                        *Password default untuk semua akun: <code>password</code>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted">Alamat Email</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <input
                                type="email"
                                placeholder="nama@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control border-start-0 ps-0"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-semibold text-muted">Kata Sandi</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control border-start-0 ps-0"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-100 py-2 fw-semibold d-flex justify-content-center align-items-center gap-2 shadow-sm"
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Memproses...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-box-arrow-in-right"></i>
                                Masuk
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}