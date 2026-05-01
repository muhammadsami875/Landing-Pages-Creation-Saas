// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Check if Vercel Blob token exists
        const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

        if (blobToken && blobToken !== "your-vercel-blob-token") {
            // Use Vercel Blob if token is configured
            const { put } = await import("@vercel/blob");
            const filename = `uploads/${Date.now()}-${file.name.replace(/\s/g, "-")}`;
            const blob = await put(filename, file, { access: "public" });
            return NextResponse.json({ url: blob.url });
        } else {
            // Fallback: convert to base64 data URL for local development
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = buffer.toString("base64");
            const mimeType = file.type || "image/jpeg";
            const dataUrl = `data:${mimeType};base64,${base64}`;
            return NextResponse.json({ url: dataUrl });
        }
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error.message || "Upload failed" },
            { status: 500 }
        );
    }
}