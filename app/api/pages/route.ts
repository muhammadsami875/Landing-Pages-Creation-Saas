// app/api/pages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const {
            slug, fullPath, businessName, phone, email, address, city, state, mapEmbedUrl,
            heroH1, heroSubheadline, ctaText,
            primaryColor, secondaryColor, accentColor,
            aboutText, damageText, localTrustText,
            metaTitle, metaDescription,
            logoUrl, heroImageUrl, images,
            services, reviews, whyChooseUs,
            published,
        } = body;

        if (!businessName || !city || !phone || !slug) {
            return NextResponse.json({ error: "Business name, city, and phone are required" }, { status: 400 });
        }

        // Handle duplicate slugs
        let finalSlug = slug;
        let finalPath = fullPath;
        const existing = await prisma.landingPage.findUnique({ where: { slug } });
        if (existing) {
            finalSlug = `${slug}-${Date.now()}`;
            finalPath = `business-profile/${finalSlug}`;
        }

        const page = await prisma.landingPage.create({
            data: {
                slug: finalSlug,
                fullPath: finalPath,
                businessName, phone,
                email: email || "",
                address: address || "",
                city, state,
                mapEmbedUrl: mapEmbedUrl || "",
                heroH1,
                heroSubheadline: heroSubheadline || "",
                ctaText: ctaText || "Request Free Inspection",
                primaryColor: primaryColor || "#1F2A6D",
                secondaryColor: secondaryColor || "#3E5F9A",
                accentColor: accentColor || "#F59E0B",
                aboutText: aboutText || "",
                damageText: damageText || "",
                localTrustText: localTrustText || "",
                metaTitle: metaTitle || `${businessName} in ${city} | Local Rankers`,
                metaDescription: metaDescription || `Professional services in ${city}. Contact ${businessName} today.`,
                logoUrl: logoUrl || "",
                heroImageUrl: heroImageUrl || "",
                images: images || [],
                services: services || [],
                reviews: reviews || [],
                whyChooseUs: whyChooseUs || [],
                published: published || false,
                createdBy: user.userId,
            },
        });

        return NextResponse.json({ success: true, page });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const pages = await prisma.landingPage.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json({ pages });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}