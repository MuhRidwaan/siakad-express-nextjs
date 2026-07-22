"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <span className="badge bg-danger text-uppercase me-2">Admin</span>;
            case "operator":
                return <span className="badge bg-primary text-uppercase me-2">Operator</span>;
            default:
                return <span className="badge bg-secondary text-uppercase me-2">Viewer</span>;
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-2">
            <div className="container">
                <Link href="/mahasiswa" className="navbar-brand fw-bold d-flex align-items-center me-4">
                    <i className="bi bi-mortarboard-fill text-warning fs-4 me-2"></i>
                    <span>SIAKAD</span>
                </Link>

                <div className="collapse navbar-collapse show" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                href="/mahasiswa"
                                className={`nav-link px-3 d-flex align-items-center ${pathname.startsWith("/mahasiswa") ? "active fw-semibold text-warning" : ""}`}
                            >
                                <i className="bi bi-people-fill me-2"></i>
                                Mahasiswa
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                href="/prodi"
                                className={`nav-link px-3 d-flex align-items-center ${pathname.startsWith("/prodi") ? "active fw-semibold text-warning" : ""}`}
                            >
                                <i className="bi bi-journal-bookmark-fill me-2"></i>
                                Prodi
                            </Link>
                        </li>
                        {user.role === "admin" && (
                            <li className="nav-item">
                                <Link
                                    href="/users"
                                    className={`nav-link px-3 d-flex align-items-center ${pathname.startsWith("/users") ? "active fw-semibold text-warning" : ""}`}
                                >
                                    <i className="bi bi-shield-lock-fill me-2"></i>
                                    Manajemen User
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center text-white">
                        <div className="me-3 text-end">
                            <div className="fw-semibold small">{user.nama}</div>
                            {getRoleBadge(user.role)}
                        </div>
                        <button
                            onClick={logout}
                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                        >
                            <i className="bi bi-box-arrow-right"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}