// app/control-panel/pages/create/page.tsx
"use client";
import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_SERVICES = [
    { name: "Roof Inspection",            description: "Professional roof inspections to assess damage and condition." },
    { name: "Roof Repair",                description: "Expert repair services for all types of roof damage." },
    { name: "Roof Installation",          description: "Full roof installation with premium materials." },
    { name: "Insurance Claim Assistance", description: "We handle your insurance claim from start to finish." },
];

const DEFAULT_WHY = [
    { title: "Licensed & Insured",    description: "Fully licensed and insured for your protection and peace of mind." },
    { title: "Fast Response",         description: "We respond quickly — often same day for urgent repairs." },
    { title: "Quality Craftsmanship", description: "Premium materials and expert workmanship on every job." },
    { title: "Honest Pricing",        description: "Transparent quotes with no hidden fees or surprises." },
];

const DEFAULT_REVIEWS = [{ name: "", city: "", rating: 5, text: "" }];

type Tab = "business" | "hero" | "colors" | "media" | "services" | "reviews" | "why" | "content" | "seo";

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "business", label: "Business", icon: "🏢" },
    { id: "hero",     label: "Hero",     icon: "🦸" },
    { id: "colors",   label: "Colors",   icon: "🎨" },
    { id: "media",    label: "Media",    icon: "🖼️" },
    { id: "services", label: "Services", icon: "🔧" },
    { id: "reviews",  label: "Reviews",  icon: "⭐" },
    { id: "why",      label: "Why Us",   icon: "✅" },
    { id: "content",  label: "Content",  icon: "✍️" },
    { id: "seo",      label: "SEO",      icon: "🔍" },
];

// ── Shared Styles ─────────────────────────────────────────────────────────────

const inp  = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
const ta   = `${inp} resize-none`;

// ── Field wrapper — defined OUTSIDE main component so it never remounts ───────

const Field = memo(({
                        label, hint, req, children,
                    }: {
    label: string; hint?: string; req?: boolean; children: React.ReactNode;
}) => (
    <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
            {label} {req && <span className="text-red-400">*</span>}
        </label>
        {hint && <p className="text-xs text-gray-600 mb-1.5">{hint}</p>}
        {children}
    </div>
));
Field.displayName = "Field";

// ── Slug helper ───────────────────────────────────────────────────────────────

const toSlug = (name: string, city: string) =>
    `${name}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ── Main Component ────────────────────────────────────────────────────────────

export default function CreatePage() {
    const router   = useRouter();
    const [loading,      setLoading]      = useState(false);
    const [uploading,    setUploading]    = useState<string | null>(null);
    const [activeTab,    setActiveTab]    = useState<Tab>("business");
    const [services,     setServices]     = useState(DEFAULT_SERVICES);
    const [whyChooseUs,  setWhyChooseUs]  = useState(DEFAULT_WHY);
    const [reviews,      setReviews]      = useState(DEFAULT_REVIEWS);
    const [galleryFiles, setGalleryFiles] = useState<string[]>([]);

    const [form, setForm] = useState({
        businessName: "", phone: "", email: "", address: "", city: "", state: "AR",
        mapEmbedUrl: "",
        heroH1: "", heroSubheadline: "", ctaText: "Request Free Inspection",
        primaryColor: "#1F2A6D", secondaryColor: "#3E5F9A", accentColor: "#F59E0B",
        aboutText: "", damageText: "", localTrustText: "",
        metaTitle: "", metaDescription: "",
        logoUrl: "", heroImageUrl: "",
        published: false,
    });

    // Stable setter — won't cause remounts
    const set = useCallback((k: string, v: any) =>
        setForm(p => ({ ...p, [k]: v })), []);

    const previewSlug = toSlug(form.businessName || "business", form.city || "city");

    // ── Upload ──────────────────────────────────────────────────────────────────

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(field);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("field", field);
            const res  = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) { set(field, data.url); toast.success("Uploaded!"); }
            else toast.error("Upload failed");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(null); }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setUploading("gallery");
        const urls: string[] = [];
        try {
            for (const file of Array.from(files)) {
                const fd = new FormData();
                fd.append("file", file);
                fd.append("field", "gallery");
                const res  = await fetch("/api/upload", { method: "POST", body: fd });
                const data = await res.json();
                if (data.url) urls.push(data.url);
            }
            setGalleryFiles(p => [...p, ...urls]);
            toast.success(`${urls.length} image(s) uploaded!`);
        } catch { toast.error("Upload failed"); }
        finally { setUploading(null); }
    };

    // ── Submit ──────────────────────────────────────────────────────────────────

    const handleSubmit = async (publish = false) => {
        if (!form.businessName || !form.city || !form.phone) {
            toast.error("Business name, city, and phone are required");
            setActiveTab("business");
            return;
        }
        if (!form.heroH1) {
            toast.error("Hero headline is required");
            setActiveTab("hero");
            return;
        }
        setLoading(true);
        try {
            const slug     = toSlug(form.businessName, form.city);
            const fullPath = `business-profile/${slug}`;
            const res = await fetch("/api/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    published: publish,
                    slug, fullPath,
                    services, whyChooseUs, reviews,
                    images: galleryFiles,
                }),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.error || "Failed to create page"); return; }
            toast.success(publish ? "Page published! 🎉" : "Saved as draft!");
            router.push(`/control-panel/pages`);
        } catch { toast.error("Something went wrong"); }
        finally { setLoading(false); }
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <div className="max-w-5xl">

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Create New Landing Page</h1>
                    <p className="text-gray-500 text-sm mt-1">Fill in all tabs then publish</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => handleSubmit(false)} disabled={loading}
                            className="px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 transition font-medium text-sm disabled:opacity-50">
                        Save Draft
                    </button>
                    <button onClick={() => handleSubmit(true)} disabled={loading}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition disabled:opacity-50">
                        {loading ? "Creating..." : "Publish Page 🚀"}
                    </button>
                </div>
            </div>

            {/* Slug preview */}
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4 mb-6">
                <p className="text-gray-500 text-xs mb-1">Your page URL will be:</p>
                <p className="text-white font-mono text-sm">
                    yoursite.com/<span className="text-blue-400">business-profile/</span>
                    <span className="text-yellow-400">{previewSlug}</span>
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-2xl p-1.5 mb-6 flex-wrap">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}>
                        <span>{tab.icon}</span>{tab.label}
                    </button>
                ))}
            </div>

            {/* Tab panels */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7">

                {/* ── BUSINESS ── */}
                {activeTab === "business" && (
                    <div className="space-y-5">
                        <h2 className="text-white font-bold text-lg mb-1">Business Information</h2>
                        <div className="grid md:grid-cols-2 gap-5">
                            <Field label="Business Name" req>
                                <input className={inp} placeholder="Weaver Construction USA"
                                       value={form.businessName}
                                       onChange={e => set("businessName", e.target.value)} />
                            </Field>
                            <Field label="City" req>
                                <input className={inp} placeholder="Denver"
                                       value={form.city}
                                       onChange={e => set("city", e.target.value)} />
                            </Field>
                            <Field label="Phone" req>
                                <input className={inp} placeholder="(303) 526-6767"
                                       value={form.phone}
                                       onChange={e => set("phone", e.target.value)} />
                            </Field>
                            <Field label="Email">
                                <input type="email" className={inp} placeholder="info@business.com"
                                       value={form.email}
                                       onChange={e => set("email", e.target.value)} />
                            </Field>
                            <Field label="State">
                                <input className={inp} placeholder="CO"
                                       value={form.state}
                                       onChange={e => set("state", e.target.value)} />
                            </Field>
                            <Field label="Full Address">
                                <input className={inp} placeholder="123 Main St, Denver, CO 80201"
                                       value={form.address}
                                       onChange={e => set("address", e.target.value)} />
                            </Field>
                        </div>
                        <Field label="Google Maps Embed URL"
                               hint="Go to Google Maps → Share → Embed a map → Copy ONLY the src URL (not the full iframe tag)">
                            <input className={inp}
                                   placeholder="https://www.google.com/maps/embed?pb=..."
                                   value={form.mapEmbedUrl}
                                   onChange={e => set("mapEmbedUrl", e.target.value)} />
                        </Field>
                    </div>
                )}

                {/* ── HERO ── */}
                {activeTab === "hero" && (
                    <div className="space-y-5">
                        <h2 className="text-white font-bold text-lg mb-1">Hero Section</h2>
                        <Field label="Hero H1 Headline" req hint="Main headline shown at top of page">
                            <input className={inp} placeholder="Trusted Roofing Company in Denver, CO"
                                   value={form.heroH1}
                                   onChange={e => set("heroH1", e.target.value)} />
                        </Field>
                        <Field label="Hero Subheadline">
              <textarea className={ta} rows={3}
                        placeholder="Professional roof repair, storm damage restoration..."
                        value={form.heroSubheadline}
                        onChange={e => set("heroSubheadline", e.target.value)} />
                        </Field>
                        <Field label="CTA Button Text">
                            <input className={inp} placeholder="Request Free Inspection"
                                   value={form.ctaText}
                                   onChange={e => set("ctaText", e.target.value)} />
                        </Field>
                    </div>
                )}

                {/* ── COLORS ── */}
                {activeTab === "colors" && (
                    <div className="space-y-6">
                        <h2 className="text-white font-bold text-lg mb-1">Color Scheme</h2>
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { key: "primaryColor",   label: "Primary Color",    hint: "Main dark color (header, buttons)" },
                                { key: "secondaryColor", label: "Secondary Color",  hint: "Accent sections, highlights" },
                                { key: "accentColor",    label: "Accent / CTA Color", hint: "Call-to-action buttons" },
                            ].map(({ key, label, hint }) => (
                                <Field key={key} label={label} hint={hint}>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <input type="color"
                                                   value={(form as any)[key]}
                                                   onChange={e => set(key, e.target.value)}
                                                   className="w-14 h-14 rounded-xl border-2 border-gray-700 bg-transparent cursor-pointer p-1" />
                                            <input className={`${inp} flex-1`}
                                                   value={(form as any)[key]}
                                                   onChange={e => set(key, e.target.value)} />
                                        </div>
                                        <div className="rounded-lg p-3 text-center text-sm font-bold text-white"
                                             style={{ backgroundColor: (form as any)[key] }}>
                                            Preview
                                        </div>
                                    </div>
                                </Field>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── MEDIA ── */}
                {activeTab === "media" && (
                    <div className="space-y-6">
                        <h2 className="text-white font-bold text-lg mb-1">Logo & Images</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Field label="Business Logo" hint="PNG/SVG with transparent background recommended">
                                <div className="border-2 border-dashed border-gray-700 rounded-xl p-5 text-center hover:border-blue-500 transition">
                                    {form.logoUrl ? (
                                        <div className="space-y-2">
                                            <img src={form.logoUrl} alt="Logo" className="h-16 mx-auto object-contain" />
                                            <button onClick={() => set("logoUrl", "")} className="text-red-400 text-xs hover:underline">Remove</button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <div className="text-3xl mb-2">🏷️</div>
                                            <p className="text-gray-400 text-sm mb-2">Click to upload logo</p>
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, "logoUrl")} />
                                            <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg">Choose File</span>
                                        </label>
                                    )}
                                    {uploading === "logoUrl" && <p className="text-blue-400 text-xs mt-2">Uploading...</p>}
                                </div>
                            </Field>

                            <Field label="Hero Image" hint="Main image shown in the hero section">
                                <div className="border-2 border-dashed border-gray-700 rounded-xl p-5 text-center hover:border-blue-500 transition">
                                    {form.heroImageUrl ? (
                                        <div className="space-y-2">
                                            <img src={form.heroImageUrl} alt="Hero" className="h-24 mx-auto object-cover rounded-lg w-full" />
                                            <button onClick={() => set("heroImageUrl", "")} className="text-red-400 text-xs hover:underline">Remove</button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <div className="text-3xl mb-2">🖼️</div>
                                            <p className="text-gray-400 text-sm mb-2">Click to upload hero image</p>
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, "heroImageUrl")} />
                                            <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg">Choose File</span>
                                        </label>
                                    )}
                                    {uploading === "heroImageUrl" && <p className="text-blue-400 text-xs mt-2">Uploading...</p>}
                                </div>
                            </Field>
                        </div>

                        <Field label="Gallery / Work Images" hint="Multiple images for the carousel (select multiple at once)">
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-5 hover:border-blue-500 transition">
                                <label className="cursor-pointer flex flex-col items-center">
                                    <div className="text-3xl mb-2">📸</div>
                                    <p className="text-gray-400 text-sm mb-2">Click to upload gallery images</p>
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                                    <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg">Choose Files</span>
                                </label>
                                {uploading === "gallery" && <p className="text-blue-400 text-xs text-center mt-2">Uploading...</p>}
                                {galleryFiles.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-4">
                                        {galleryFiles.map((url, i) => (
                                            <div key={i} className="relative group">
                                                <img src={url} alt="" className="rounded-lg h-16 w-full object-cover" />
                                                <button onClick={() => setGalleryFiles(p => p.filter((_, j) => j !== i))}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Field>
                    </div>
                )}

                {/* ── SERVICES ── */}
                {activeTab === "services" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white font-bold text-lg">Services</h2>
                            <button onClick={() => setServices(p => [...p, { name: "", description: "" }])}
                                    className="text-blue-400 text-sm font-medium bg-blue-950 px-3 py-1.5 rounded-lg hover:bg-blue-900 transition">
                                + Add Service
                            </button>
                        </div>
                        {services.map((s, i) => (
                            <div key={i} className="flex gap-3 items-start bg-gray-800 rounded-xl p-4">
                                <div className="flex-1 grid md:grid-cols-2 gap-3">
                                    <input className={inp} placeholder="Service name"
                                           value={s.name}
                                           onChange={e => {
                                               const n = [...services];
                                               n[i] = { ...n[i], name: e.target.value };
                                               setServices(n);
                                           }} />
                                    <input className={inp} placeholder="Short description"
                                           value={s.description}
                                           onChange={e => {
                                               const n = [...services];
                                               n[i] = { ...n[i], description: e.target.value };
                                               setServices(n);
                                           }} />
                                </div>
                                <button onClick={() => setServices(p => p.filter((_, j) => j !== i))}
                                        className="text-red-400 hover:text-red-300 mt-2 text-2xl leading-none">×</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── REVIEWS ── */}
                {activeTab === "reviews" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white font-bold text-lg">Customer Reviews</h2>
                            <button onClick={() => setReviews(p => [...p, { name: "", city: "", rating: 5, text: "" }])}
                                    className="text-blue-400 text-sm font-medium bg-blue-950 px-3 py-1.5 rounded-lg hover:bg-blue-900 transition">
                                + Add Review
                            </button>
                        </div>
                        {reviews.map((r, i) => (
                            <div key={i} className="bg-gray-800 rounded-xl p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm font-medium">Review #{i + 1}</span>
                                    <button onClick={() => setReviews(p => p.filter((_, j) => j !== i))}
                                            className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <input className={inp} placeholder="Reviewer name"
                                           value={r.name}
                                           onChange={e => {
                                               const n = [...reviews];
                                               n[i] = { ...n[i], name: e.target.value };
                                               setReviews(n);
                                           }} />
                                    <input className={inp} placeholder="City"
                                           value={r.city}
                                           onChange={e => {
                                               const n = [...reviews];
                                               n[i] = { ...n[i], city: e.target.value };
                                               setReviews(n);
                                           }} />
                                    <select className={inp} value={r.rating}
                                            onChange={e => {
                                                const n = [...reviews];
                                                n[i] = { ...n[i], rating: Number(e.target.value) };
                                                setReviews(n);
                                            }}>
                                        {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} Stars</option>)}
                                    </select>
                                </div>
                                <textarea className={ta} rows={3} placeholder="Review text..."
                                          value={r.text}
                                          onChange={e => {
                                              const n = [...reviews];
                                              n[i] = { ...n[i], text: e.target.value };
                                              setReviews(n);
                                          }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* ── WHY CHOOSE US ── */}
                {activeTab === "why" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white font-bold text-lg">Why Choose Us</h2>
                            <button onClick={() => setWhyChooseUs(p => [...p, { title: "", description: "" }])}
                                    className="text-blue-400 text-sm font-medium bg-blue-950 px-3 py-1.5 rounded-lg hover:bg-blue-900 transition">
                                + Add Item
                            </button>
                        </div>
                        {whyChooseUs.map((w, i) => (
                            <div key={i} className="flex gap-3 items-start bg-gray-800 rounded-xl p-4">
                                <div className="flex-1 grid md:grid-cols-2 gap-3">
                                    <input className={inp} placeholder="Title (e.g. Licensed & Insured)"
                                           value={w.title}
                                           onChange={e => {
                                               const n = [...whyChooseUs];
                                               n[i] = { ...n[i], title: e.target.value };
                                               setWhyChooseUs(n);
                                           }} />
                                    <input className={inp} placeholder="Description"
                                           value={w.description}
                                           onChange={e => {
                                               const n = [...whyChooseUs];
                                               n[i] = { ...n[i], description: e.target.value };
                                               setWhyChooseUs(n);
                                           }} />
                                </div>
                                <button onClick={() => setWhyChooseUs(p => p.filter((_, j) => j !== i))}
                                        className="text-red-400 hover:text-red-300 mt-2 text-2xl leading-none">×</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── CONTENT ── */}
                {activeTab === "content" && (
                    <div className="space-y-5">
                        <h2 className="text-white font-bold text-lg mb-1">Page Content Sections</h2>
                        <Field label="About Section Text">
              <textarea className={ta} rows={5}
                        placeholder="Tell visitors about this business..."
                        value={form.aboutText}
                        onChange={e => set("aboutText", e.target.value)} />
                        </Field>
                        <Field label="Storm / Damage Section Text">
              <textarea className={ta} rows={4}
                        placeholder="Describe damage/urgency services..."
                        value={form.damageText}
                        onChange={e => set("damageText", e.target.value)} />
                        </Field>
                        <Field label="Local Trust Section Text">
              <textarea className={ta} rows={4}
                        placeholder="Why this business is trusted locally..."
                        value={form.localTrustText}
                        onChange={e => set("localTrustText", e.target.value)} />
                        </Field>
                    </div>
                )}

                {/* ── SEO ── */}
                {activeTab === "seo" && (
                    <div className="space-y-5">
                        <h2 className="text-white font-bold text-lg mb-1">SEO Settings</h2>
                        <Field label="Meta Title" hint="Shown in Google search (50-60 characters)">
                            <input className={inp}
                                   placeholder={`${form.businessName || "Business"} in ${form.city || "City"} | Local Rankers`}
                                   value={form.metaTitle}
                                   onChange={e => set("metaTitle", e.target.value)} />
                            <div className="text-xs text-gray-600 mt-1">{form.metaTitle.length}/60 characters</div>
                        </Field>
                        <Field label="Meta Description" hint="Shown in Google search (150-160 characters)">
              <textarea className={ta} rows={3}
                        placeholder={`Professional services in ${form.city || "your city"}. Contact ${form.businessName || "us"} today.`}
                        value={form.metaDescription}
                        onChange={e => set("metaDescription", e.target.value)} />
                            <div className="text-xs text-gray-600 mt-1">{form.metaDescription.length}/160 characters</div>
                        </Field>
                    </div>
                )}

            </div>

            {/* Bottom bar */}
            <div className="mt-6 flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-5 rounded-full transition-colors cursor-pointer relative"
                        style={{ backgroundColor: form.published ? "#22c55e" : "#374151" }}
                        onClick={() => set("published", !form.published)}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-5" : "translate-x-0.5"}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-300">
            {form.published ? "Publish immediately" : "Save as draft"}
          </span>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => router.back()}
                            className="px-5 py-2.5 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition text-sm font-medium">
                        Cancel
                    </button>
                    <button onClick={() => handleSubmit(false)} disabled={loading}
                            className="px-5 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-xl hover:bg-gray-600 transition text-sm font-medium disabled:opacity-50">
                        Save Draft
                    </button>
                    <button onClick={() => handleSubmit(true)} disabled={loading}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition disabled:opacity-50">
                        {loading ? "Creating..." : "🚀 Publish Page"}
                    </button>
                </div>
            </div>
        </div>
    );
}