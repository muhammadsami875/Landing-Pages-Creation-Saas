// lib/auth.ts
import { cookies } from "next/headers";
import { verifyToken, JWTPayload } from "./jwt";

export async function getCurrentUser(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    return await verifyToken(token);
}

export async function requireAuth(): Promise<JWTPayload> {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function requireAdmin(): Promise<JWTPayload> {
    const user = await requireAuth();
    if (user.role !== "ADMIN") {
        throw new Error("Forbidden");
    }
    return user;
}