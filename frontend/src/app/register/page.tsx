"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        // Pendaftaran mandiri ditutup untuk keamanan. Mengarahkan ke login.
        const timer = setTimeout(() => {
            router.push("/login");
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center flex-grow-1">
            <div className="card shadow border-0 rounded-4 p-4 text-center" style={{ maxWidth: "440px", width: "100%" }}>
                <div className="bg-warning-subtle text-warning-emphasis rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "64px", height: "64px" }}>
                    <i className="bi bi-shield-lock-fill fs-2"></i>
                </div>
                <h4 className="fw-bold mb-2">Pendaftaran Publik Ditutup</h4>
                <p className="text-muted small mb-4">
                    Untuk keamanan sistem, pembuatan akun pengguna baru hanya dapat dilakukan oleh <strong>Administrator</strong> via menu Manajemen User.
                </p>
                <div className="alert alert-info py-2 px-3 small mb-4">
                    Mengarahkan Anda ke halaman login...
                </div>
                <Link href="/login" className="btn btn-primary w-100 py-2 fw-semibold">
                    Kembali ke Halaman Login
                </Link>
            </div>
        </div>
    );
}