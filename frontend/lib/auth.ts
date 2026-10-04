import { jwtVerify } from "jose";

export const COOKIE_NAME = "token";
export type Role = "user" | "admin";
export type SessionUser = { id: string; role: Role };

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyToken(token?: string): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { id: payload.id as string, role: payload.role as Role };
  } catch {
    return null; 
  }
}

export const homeFor = (role: Role) =>
  role === "admin" ? "/admin" : "/dashboard";
