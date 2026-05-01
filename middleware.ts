// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Block old public /register route ──
    if (pathname === "/register") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // ── Allow /control-panel/login always ──
    if (pathname === "/control-panel/login") {
        const token = request.cookies.get("auth-token")?.value;
        if (token) {
            try {
                const user = await verifyToken(token);
                if (user?.role === "ADMIN") {
                    return NextResponse.redirect(new URL("/control-panel", request.url));
                }
            } catch {
                // bad token — show login
            }
        }
        return NextResponse.next();
    }

    // ── Protect all /control-panel routes (including /register) ──
    if (pathname.startsWith("/control-panel")) {
        const token = request.cookies.get("auth-token")?.value;
        if (!token) {
            return NextResponse.redirect(new URL("/control-panel/login", request.url));
        }
        try {
            const user = await verifyToken(token);
            if (!user || user.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/control-panel/login", request.url));
            }
        } catch {
            return NextResponse.redirect(new URL("/control-panel/login", request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/control-panel/:path*",
        "/register",
    ],
};