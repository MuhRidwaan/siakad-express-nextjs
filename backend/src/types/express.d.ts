// Express types declaration (e.g. extending Request with user details)
export interface AuthUser {
    id: number;
    nama: string;
    role: "admin" | "operator" | "viewer";
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export { };