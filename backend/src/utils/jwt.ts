// JWT utilities (sign and verify tokens)

import jwt from "jsonwebtoken";
import { AuthUser } from "../types/express";

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const signToken = (payload: AuthUser): string => {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
};

export const verifyJwt = (token: string): AuthUser => {
    return jwt.verify(token, SECRET) as AuthUser;
};