// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: currentUser.userId },
            select: { id: true, email: true, role: true, createdAt: true },
        });

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}