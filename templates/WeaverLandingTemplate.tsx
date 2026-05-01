// templates/WeaverLandingTemplate.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Phone, Mail, MapPin, Star, Shield, CheckCircle,
    Award, Zap, Home, Send, Quote, ChevronLeft, ChevronRight,
    CloudLightning, Eye, Wrench, FileCheck, HardHat, AlertTriangle, Users
} from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    }),
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: (i: number = 0) => ({
        opacity: 1, scale: 1,
        transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }),
};

const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TemplateClient {
    businessName: string;
    phone: string;
    email: string;
    address: string;
    logoUrl?: string;
}

export interface TemplateArea {
    city: string;
    state: string;
    slug: string;
    heroH1: string;
    heroSubheadline: string;
    ctaText: string;
    aboutText: string;
    stormDamageText: string;
    localTrustText: string;
    services: { name: string; description: string }[];
    reviews: { name: string; city: string; rating: number; text: string }[];
    whyChooseUs: { title: string; description: string }[];
    metaTitle: string;
    metaDescription: string;
    heroImageUrl?: string;
    images: string[];
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    mapEmbedUrl?: string;
}

interface Props {
    client: TemplateClient;
    area: TemplateArea;
}

// ─── Service Icons ────────────────────────────────────────────────────────────

const serviceIconMap: Record<string, React.ReactNode> = {
    "Roof Inspection":            <Eye className="w-6 h-6" />,
    "Roof Repair":                <Wrench className="w-6 h-6" />,
    "Roof Installation":          <HardHat className="w-6 h-6" />,
    "Skylight Repair":            <Home className="w-6 h-6" />,
    "Siding Repair":              <Shield className="w-6 h-6" />,
    "Insurance Claim Assistance": <FileCheck className="w-6 h-6" />,
    "Foundation Repair":          <HardHat className="w-6 h-6" />,
    "Waterproofing":              <Shield className="w-6 h-6" />,
    "Concrete Lifting":           <Wrench className="w-6 h-6" />,
    "Plumbing":                   <Wrench className="w-6 h-6" />,
    "HVAC":                       <Zap className="w-6 h-6" />,
};

const getServiceIcon = (name: string) =>
    serviceIconMap[name] ?? <Wrench className="w-6 h-6" />;

const whyIconsList = [
    (c: string) => <Shield className="w-7 h-7" style={{ color: c }} />,
    (c: string) => <Zap    className="w-7 h-7" style={{ color: c }} />,
    (c: string) => <Award  className="w-7 h-7" style={{ color: c }} />,
    (c: string) => <Users  className="w-7 h-7" style={{ color: c }} />,
];

// ─── Review Card ──────────────────────────────────────────────────────────────

const ReviewCard = ({
                        review, pc,
                    }: {
    review: TemplateArea["reviews"][0];
    pc: string;
}) => (
    <div className="flex-shrink-0 w-[340px] mx-3 rounded-2xl p-6 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500">
        <div className="flex gap-1 mb-3">
            {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
        <Quote className="w-6 h-6 mb-2" style={{ color: pc + "44" }} />
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{review.text}</p>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                 style={{ backgroundColor: pc }}>
                {review.name.charAt(0)}
            </div>
            <div>
                <div className="font-semibold text-sm text-gray-900">{review.name}</div>
                {review.city && <div className="text-xs text-gray-500">{review.city}</div>}
            </div>
        </div>
    </div>
);

// ─── Image Carousel ───────────────────────────────────────────────────────────

const ImageCarousel = ({
                           images, city, sc,
                       }: {
    images: string[]; city: string; sc: string;
}) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (images.length < 2) return;
        const t = setInterval(() => setCurrent(p => (p + 1) % images.length), 5000);
        return () => clearInterval(t);
    }, [images.length]);

    if (!images.length) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-5xl mx-auto"
        >
            <div className="relative overflow-hidden rounded-3xl aspect-video bg-gray-200 shadow-2xl">
                {images.map((src, i) => (
                    <motion.img
                        key={i} src={src} alt={`Work in ${city}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={false}
                        animate={{ opacity: i === current ? 1 : 0, scale: i === current ? 1 : 1.05 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {images.length > 1 && (
                    <>
                        <button onClick={() => setCurrent(p => (p - 1 + images.length) % images.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrent(p => (p + 1) % images.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-5">
                    {images.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)}
                                className="rounded-full transition-all duration-300 h-2.5"
                                style={{ width: i === current ? "2rem" : "0.625rem", backgroundColor: i === current ? sc : "#D1D5DB" }} />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

// ─── Section Label ────────────────────────────────────────────────────────────

const SectionLabel = ({ text, sc }: { text: string; sc: string }) => (
    <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-4 h-4" style={{ clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)", backgroundColor: sc }} />
        <span className="font-semibold text-sm uppercase tracking-[0.2em]" style={{ color: sc }}>{text}</span>
        <div className="w-4 h-4" style={{ clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)", backgroundColor: sc }} />
    </div>
);

// ─── Placeholder Box ──────────────────────────────────────────────────────────

const ImgPlaceholder = ({ label, sc }: { label: string; sc: string }) => (
    <div className="rounded-3xl w-full aspect-[4/3] flex items-center justify-center border-2 border-dashed"
         style={{ borderColor: sc + "44", background: sc + "08" }}>
        <div className="text-center" style={{ color: sc + "88" }}>
            <Home className="w-14 h-14 mx-auto mb-2" />
            <p className="text-sm font-medium">{label}</p>
        </div>
    </div>
);

// ─── Main Template ────────────────────────────────────────────────────────────

const WeaverLandingTemplate = ({ client, area }: Props) => {
    const pc = area.primaryColor   || "#1F2A6D";
    const sc = area.secondaryColor || "#3E5F9A";
    const ac = area.accentColor    || "#F59E0B";

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const cleanPhone = client.phone.replace(/[^0-9]/g, "");
    const heroWords  = area.heroH1.split(" ");
    const row1 = area.reviews.slice(0, Math.ceil(area.reviews.length / 2));
    const row2 = area.reviews.slice(Math.ceil(area.reviews.length / 2));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: client.businessName,
        telephone: client.phone,
        email: client.email,
        address: { "@type": "PostalAddress", streetAddress: client.address, addressLocality: area.city, addressRegion: area.state, addressCountry: "US" },
        areaServed: { "@type": "City", name: area.city },
        description: area.metaDescription,
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] text-[#222] overflow-x-hidden"
             style={{ fontFamily: "'DM Sans', sans-serif" }}>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');
        @keyframes marqueeLeft  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes marqueeRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
      `}</style>

            <script type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* ── NAVBAR ── */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-sm"
            >
                <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {client.logoUrl
                            ? <img src={client.logoUrl} alt={client.businessName} className="h-10 w-auto object-contain" />
                            : <div className="h-10 px-3 rounded-lg flex items-center justify-center text-white font-black text-sm"
                                   style={{ backgroundColor: pc }}>
                                {client.businessName.charAt(0)}
                            </div>
                        }
                        <div className="hidden sm:block">
              <span className="font-bold text-base block leading-tight" style={{ color: pc }}>
                {client.businessName}
              </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Licensed Contractor</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={`mailto:${client.email}`}
                           className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition">
                            <Mail className="w-4 h-4" />
                            <span className="hidden lg:inline">{client.email}</span>
                        </a>
                        <a href={`tel:${cleanPhone}`}
                           className="text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:opacity-90 transition"
                           style={{ backgroundColor: pc }}>
                            <Phone className="w-4 h-4" />
                            {client.phone}
                        </a>
                    </div>
                </div>
            </motion.header>

            {/* ── HERO ── */}
            <section ref={heroRef}
                     className="relative min-h-screen flex items-center overflow-hidden pt-20"
                     style={{ background: `linear-gradient(135deg, ${sc} 0%, ${pc} 100%)` }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: ac + "44" }} />
                </div>

                <motion.div style={{ opacity: heroOpacity }} className="container mx-auto px-6 relative z-10 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Copy */}
                        <div>
                            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-8">
                                    <MapPin className="w-4 h-4" style={{ color: ac }} />
                                    Serving {area.city}, {area.state}
                                </div>
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                {heroWords.map((word, i) => (
                                    <motion.span key={i}
                                                 initial={{ opacity: 0, y: 60, rotateX: 30 }}
                                                 animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                 transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                                 className="inline-block mr-[0.3em]"
                                                 style={{ color: word === area.city ? ac : "white" }}>
                                        {word}
                                    </motion.span>
                                ))}
                            </h1>

                            <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={3}
                                      className="mt-6 text-lg text-white/75 max-w-xl leading-relaxed">
                                {area.heroSubheadline}
                            </motion.p>

                            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
                                        className="mt-8 flex flex-col sm:flex-row gap-4">
                                <a href={`tel:${cleanPhone}`}
                                   className="text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 transition-all border border-white/10"
                                   style={{ backgroundColor: pc }}>
                                    <Phone className="w-5 h-5" /> {area.ctaText}
                                </a>
                                <a href={`mailto:${client.email}`}
                                   className="border-2 border-white/25 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/10 hover:-translate-y-1 transition-all"
                                   style={{ backgroundColor: sc }}>
                                    <Mail className="w-5 h-5" /> Contact Us Now
                                </a>
                            </motion.div>
                        </div>

                        {/* Hero image */}
                        <motion.div initial="hidden" animate="visible" variants={slideInRight} className="hidden lg:block">
                            {area.heroImageUrl
                                ? <div className="relative">
                                    <img src={area.heroImageUrl} alt={`${client.businessName} in ${area.city}`}
                                         className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
                                    <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">500+ Jobs Completed</div>
                                            <div className="text-xs text-gray-500">Across {area.state}</div>
                                        </div>
                                    </div>
                                </div>
                                : <div className="rounded-3xl aspect-[4/3] flex items-center justify-center border border-white/20"
                                       style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                                    <div className="text-center text-white/30">
                                        <Home className="w-20 h-20 mx-auto mb-3" />
                                        <p className="text-sm">Add hero image via admin</p>
                                    </div>
                                </div>
                            }
                        </motion.div>
                    </div>

                    {/* Stats */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}
                                className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { value: "500+",  label: "Jobs Completed",     Icon: Home      },
                            { value: "99%",   label: "Satisfaction Rate",  Icon: FileCheck },
                            { value: "4.9/5", label: "Google Rating",      Icon: Star      },
                            { value: "24hr",  label: "Emergency Response", Icon: Zap       },
                        ].map(({ value, label, Icon }, i) => (
                            <motion.div key={label} variants={scaleIn} custom={i}
                                        className="rounded-xl p-4 sm:p-5 border border-white/10 bg-white/5 backdrop-blur-sm">
                                <Icon className="w-5 h-5 mb-2" style={{ color: ac }} />
                                <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
                                <div className="text-xs sm:text-sm text-white/50 mt-0.5">{label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ── ABOUT ── */}
            <section className="py-20 sm:py-28 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInLeft}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8" style={{ clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)", backgroundColor: sc }} />
                                <span className="font-semibold text-sm uppercase tracking-[0.2em]" style={{ color: sc }}>About Us</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Built on Trust,<br /><span style={{ color: sc }}>Driven by Results</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                                {area.aboutText || `${client.businessName} has been proudly serving ${area.city} and surrounding areas with top-quality workmanship and honest service. We are locally owned, licensed, and insured.`}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href={`tel:${cleanPhone}`}
                                   className="text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition"
                                   style={{ backgroundColor: pc }}>
                                    <Phone className="w-4 h-4" /> Call {client.phone}
                                </a>
                                <a href={`mailto:${client.email}`}
                                   className="border-2 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:-translate-y-0.5 transition"
                                   style={{ borderColor: sc, color: sc }}>
                                    <Mail className="w-4 h-4" /> Email Us
                                </a>
                            </div>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInRight}>
                            {area.images[0]
                                ? <img src={area.images[0]} alt={`${client.businessName}`}
                                       className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
                                : <ImgPlaceholder label="Add about image via admin" sc={sc} />
                            }
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── SERVICES ── */}
            {area.services.length > 0 && (
                <section className="py-20 sm:py-28 bg-[#F5F5F5]">
                    <div className="container mx-auto px-6">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                                    className="max-w-2xl mb-16">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-6 h-6" style={{ clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)", backgroundColor: sc }} />
                                <span className="font-semibold text-sm uppercase tracking-[0.2em]" style={{ color: sc }}>Our Services</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Services in <span style={{ color: sc }}>{area.city}</span>
                            </h2>
                            <p className="mt-4 text-gray-600 text-lg">High-quality services for {area.city} homeowners and businesses.</p>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {area.services.map((service, i) => (
                                <motion.div key={i} variants={staggerItem}
                                            className="group bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                         style={{ background: `linear-gradient(to right, ${sc}, ${pc})` }} />
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                                         style={{ backgroundColor: sc + "18", color: sc }}>
                                        {getServiceIcon(service.name)}
                                    </div>
                                    <h3 className="font-bold text-xl mb-3" style={{ color: pc }}>{service.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── IMAGE CAROUSEL ── */}
            {area.images.length > 0 && (
                <section className="py-20 sm:py-28 bg-white">
                    <div className="container mx-auto px-6">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                                    className="text-center mb-12">
                            <SectionLabel text="Our Work" sc={sc} />
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Quality Craftsmanship in {area.city}
                            </h2>
                        </motion.div>
                        <ImageCarousel images={area.images} city={area.city} sc={sc} />
                    </div>
                </section>
            )}

            {/* ── WHY CHOOSE US ── */}
            {area.whyChooseUs.length > 0 && (
                <section className="py-20 sm:py-28 bg-[#F5F5F5]">
                    <div className="container mx-auto px-6">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                                    className="text-center max-w-3xl mx-auto mb-16">
                            <SectionLabel text="Why Choose Us" sc={sc} />
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Why {area.city} Homeowners <span style={{ color: sc }}>Trust Us</span>
                            </h2>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {area.whyChooseUs.map((item, i) => (
                                <motion.div key={i} variants={scaleIn} custom={i}
                                            className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center">
                                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                                         style={{ backgroundColor: sc + "18" }}>
                                        {whyIconsList[i % whyIconsList.length](sc)}
                                    </div>
                                    <h3 className="font-bold text-lg mb-3" style={{ color: pc }}>{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── STORM / DAMAGE ── */}
            {area.stormDamageText && (
                <section className="py-20 sm:py-28 relative overflow-hidden"
                         style={{ background: `linear-gradient(135deg, ${pc} 0%, ${sc} 100%)` }}>
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-10 right-20 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: ac + "44" }} />
                        <div className="absolute bottom-10 left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                    </div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInLeft}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 text-sm font-semibold"
                                     style={{ backgroundColor: ac + "33", borderColor: ac + "55", color: ac }}>
                                    <AlertTriangle className="w-4 h-4" /> Urgent Services Available
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6"
                                    style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Damage in <span style={{ color: ac }}>{area.city}</span>?
                                </h2>
                                <p className="text-white/75 leading-relaxed mb-8 text-lg">{area.stormDamageText}</p>
                                <a href={`tel:${cleanPhone}`}
                                   className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:-translate-y-1 transition-all"
                                   style={{ backgroundColor: ac, color: pc }}>
                                    <Phone className="w-5 h-5" /> Get FREE Inspection
                                </a>
                            </motion.div>
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInRight}
                                        className="hidden lg:block">
                                {area.images[1]
                                    ? <img src={area.images[1]} alt="Damage repair" className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
                                    : <div className="rounded-3xl aspect-[4/3] flex items-center justify-center border border-white/20"
                                           style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                                        <div className="text-center text-white/30">
                                            <AlertTriangle className="w-16 h-16 mx-auto mb-3" />
                                            <p className="text-sm">Add image via admin</p>
                                        </div>
                                    </div>
                                }
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── REVIEWS ── */}
            {area.reviews.length > 0 && (
                <section className="py-20 sm:py-28 bg-white overflow-hidden">
                    <div className="container mx-auto px-6 mb-12">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                                    className="text-center">
                            <SectionLabel text="Reviews" sc={sc} />
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                What Our Clients Say
                            </h2>
                            <p className="mt-4 text-gray-500">Real reviews from satisfied customers in {area.city}</p>
                        </motion.div>
                    </div>
                    <div className="space-y-6">
                        {row1.length > 0 && (
                            <div className="overflow-hidden">
                                <div className="flex" style={{ width: "max-content", animation: "marqueeLeft 40s linear infinite" }}>
                                    {[...row1, ...row1].map((r, i) => <ReviewCard key={`r1-${i}`} review={r} pc={pc} />)}
                                </div>
                            </div>
                        )}
                        {row2.length > 0 && (
                            <div className="overflow-hidden">
                                <div className="flex" style={{ width: "max-content", animation: "marqueeRight 40s linear infinite" }}>
                                    {[...row2, ...row2].map((r, i) => <ReviewCard key={`r2-${i}`} review={r} pc={pc} />)}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── LOCAL TRUST ── */}
            <section className="py-20 sm:py-28 bg-[#F5F5F5]">
                <div className="container mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                                className="max-w-4xl mx-auto text-center">
                        <SectionLabel text="Local Trust" sc={sc} />
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}>
                            Proudly Serving <span style={{ color: sc }}>{area.city}</span> & Surrounding Areas
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {area.localTrustText || `We are proud to serve ${area.city} and the surrounding communities with honest, high-quality work.`}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {["Licensed & Insured", "5-Star Reviews", "Free Estimates", "Fast Response"].map(badge => (
                                <div key={badge} className="flex items-center gap-2 bg-white px-5 py-3 rounded-full border border-gray-200 shadow-sm">
                                    <CheckCircle className="w-4 h-4" style={{ color: sc }} />
                                    <span className="text-sm font-semibold" style={{ color: pc }}>{badge}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── GOOGLE MAP ── */}
            {area.mapEmbedUrl && (
                <section className="py-20 sm:py-28 bg-white">
                    <div className="container mx-auto px-6">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                                    className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Find <span style={{ color: sc }}>{client.businessName}</span> on Google
                            </h2>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ duration: 0.8 }}
                                    className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                            <iframe src={area.mapEmbedUrl} width="100%" height="450"
                                    style={{ border: 0 }} allowFullScreen loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`${client.businessName} near ${area.city}`} />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <section className="py-20 sm:py-28 relative overflow-hidden"
                     style={{ background: `linear-gradient(135deg, ${sc} 0%, ${pc} 100%)` }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: ac + "44" }} />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                        <CloudLightning className="w-16 h-16 mx-auto mb-6" style={{ color: ac }} />
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}>
                            Ready to Get Started in {area.city}?
                        </h2>
                        <p className="text-white/70 text-xl max-w-2xl mx-auto mb-10">
                            Get a free estimate today. Our {area.city} team is ready to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href={`tel:${cleanPhone}`}
                               className="text-white px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 border border-white/10 transition-all"
                               style={{ backgroundColor: pc }}>
                                <Phone className="w-5 h-5" /> {area.ctaText}
                            </a>
                            <a href={`mailto:${client.email}`}
                               className="px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 transition-all"
                               style={{ backgroundColor: ac, color: pc }}>
                                <Mail className="w-5 h-5" /> Email Us Now
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTACT FORM ── */}
            <section className="py-20 sm:py-28 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                                className="text-center mb-16">
                        <SectionLabel text="Contact" sc={sc} />
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}>
                            Get in Touch with <span style={{ color: sc }}>{client.businessName}</span>
                        </h2>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Form */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInLeft}>
                            {submitted ? (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                                    <p className="text-green-700">Our {area.city} team will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
                                      className="bg-[#F5F5F5] border border-gray-200 rounded-2xl p-8 space-y-5">
                                    {[
                                        { key: "name",    label: "Full Name",   type: "text",  placeholder: "Your name"          },
                                        { key: "email",   label: "Email",       type: "email", placeholder: "email@example.com"   },
                                        { key: "phone",   label: "Phone",       type: "tel",   placeholder: "(000) 000-0000"       },
                                    ].map(({ key, label, type, placeholder }) => (
                                        <div key={key}>
                                            <label className="block text-sm font-semibold mb-2" style={{ color: pc }}>{label}</label>
                                            <input type={type} required placeholder={placeholder}
                                                   value={(form as any)[key]}
                                                   onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                                   className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 transition-all"
                                                   style={{ "--tw-ring-color": sc } as any} />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: pc }}>Message</label>
                                        <textarea rows={4} placeholder="Tell us about your needs..."
                                                  value={form.message}
                                                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 transition-all resize-none" />
                                    </div>
                                    <button type="submit"
                                            className="w-full text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:-translate-y-0.5 transition-all"
                                            style={{ backgroundColor: pc }}>
                                        <Send className="w-5 h-5" /> Request Consultation
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInRight}
                                    className="space-y-8">
                            <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: pc }}>
                                {client.businessName}
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { href: `tel:${cleanPhone}`,      Icon: Phone,  label: "Call Us",  value: client.phone   },
                                    { href: `mailto:${client.email}`, Icon: Mail,   label: "Email Us", value: client.email   },
                                    ...(client.address ? [{ href: "#", Icon: MapPin, label: "Location", value: client.address }] : []),
                                ].map(({ href, Icon, label, value }, i) => (
                                    <a key={i} href={href}
                                       className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-xl hover:opacity-80 transition group">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                             style={{ backgroundColor: sc + "18", color: sc }}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">{label}</div>
                                            <div className="font-bold" style={{ color: pc }}>{value}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="bg-[#F5F5F5] rounded-2xl p-6 border border-gray-200">
                                <h4 className="font-bold text-lg mb-3" style={{ color: pc }}>Service Hours</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between"><span>Monday – Friday</span><span className="font-semibold">7:00 AM – 7:00 PM</span></div>
                                    <div className="flex justify-between"><span>Saturday</span><span className="font-semibold">8:00 AM – 5:00 PM</span></div>
                                    <div className="flex justify-between"><span>Sunday</span><span className="font-semibold">Emergency Only</span></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 font-semibold text-sm"
                                     style={{ color: sc }}>
                                    <Zap className="w-4 h-4" />
                                    24/7 Emergency Response Available
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="py-10 text-center"
                    style={{ background: `linear-gradient(135deg, ${pc} 0%, ${sc} 100%)` }}>
                <div className="container mx-auto px-6">
                    {client.logoUrl
                        ? <img src={client.logoUrl} alt={client.businessName}
                               className="h-10 mx-auto mb-4 brightness-0 invert object-contain" />
                        : <div className="text-white font-black text-xl mb-4">{client.businessName}</div>
                    }
                    <p className="text-white/60 text-sm">© {new Date().getFullYear()} {client.businessName}. All rights reserved.</p>
                    <p className="text-white/40 text-xs mt-1">Proudly serving {area.city}, {area.state} and surrounding communities.</p>
                </div>
            </footer>

        </div>
    );
};

export default WeaverLandingTemplate;