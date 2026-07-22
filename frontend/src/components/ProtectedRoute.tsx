"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: ReactNode;
    allowedRoles?: string[];
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push("/login");
            return;
        }
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            router.push("/mahasiswa");
        }
    }, [user, loading, allowedRoles, router]);

    if (loading || !user) return <p className="p-6">Memuat...</p>;
    if (allowedRoles && !allowedRoles.includes(user.role)) return null;

    return <>{children}</>;
}