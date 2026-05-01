// app/business-profile/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import WeaverLandingTemplate from "@/templates/WeaverLandingTemplate";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { slug } = await params;
        const page = await prisma.landingPage.findFirst({
            where: { slug },
        });
        if (!page) return { title: "Not Found" };
        return {
            title: page.metaTitle || page.businessName,
            description: page.metaDescription || "",
        };
    } catch {
        return { title: "Not Found" };
    }
}

export default async function BusinessProfilePage({ params }: Props) {
    try {
        const { slug } = await params;

        const page = await prisma.landingPage.findFirst({
            where: { slug },
        });

        if (!page || !page.published) notFound();

        const client = {
            businessName: page.businessName,
            phone: page.phone,
            email: page.email,
            address: page.address || "",
            logoUrl: page.logoUrl || "",
        };

        const area = {
            city: page.city,
            state: page.state,
            slug: page.slug,
            heroH1: page.heroH1,
            heroSubheadline: page.heroSubheadline || "",
            ctaText: page.ctaText,
            aboutText: page.aboutText || "",
            stormDamageText: (page as any).damageText || "",
            localTrustText: page.localTrustText || "",
            services: (page.services as any[]) || [],
            reviews: (page.reviews as any[]) || [],
            whyChooseUs: (page.whyChooseUs as any[]) || [],
            metaTitle: page.metaTitle || "",
            metaDescription: page.metaDescription || "",
            heroImageUrl: page.heroImageUrl || "",
            images: page.images || [],
            primaryColor: page.primaryColor,
            secondaryColor: page.secondaryColor,
            accentColor: page.accentColor,
            mapEmbedUrl: (page as any).mapEmbedUrl || "",
        };

        return <WeaverLandingTemplate client={client} area={area} />;
    } catch (error) {
        console.error("Page error:", error);
        notFound();
    }
}