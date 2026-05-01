// app/page.tsx
import Link from "next/link";

const businessCategories = [
    { icon: "🔧", name: "Plumbing", count: "120+ Pages" },
    { icon: "⚡", name: "Electrical", count: "95+ Pages" },
    { icon: "🏗️", name: "Foundation Repair", count: "80+ Pages" },
    { icon: "🌿", name: "Landscaping", count: "110+ Pages" },
    { icon: "🏠", name: "Roofing", count: "75+ Pages" },
    { icon: "❄️", name: "HVAC", count: "90+ Pages" },
    { icon: "🚗", name: "Auto Services", count: "65+ Pages" },
    { icon: "🦷", name: "Dental", count: "55+ Pages" },
    { icon: "⚖️", name: "Legal Services", count: "45+ Pages" },
    { icon: "🍕", name: "Restaurants", count: "130+ Pages" },
    { icon: "💆", name: "Spa & Wellness", count: "60+ Pages" },
    { icon: "🐾", name: "Pet Services", count: "50+ Pages" },
];

const serviceAreas = [
    { state: "Arkansas", cities: ["Fayetteville", "Springdale", "Rogers", "Bentonville", "Bella Vista"] },
    { state: "New York", cities: ["New York City", "Buffalo", "Albany", "Syracuse", "Rochester"] },
    { state: "Texas", cities: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"] },
    { state: "California", cities: ["Los Angeles", "San Diego", "San Francisco", "Sacramento", "Fresno"] },
    { state: "Florida", cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"] },
    { state: "Illinois", cities: ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"] },
];

const stats = [
    { value: "500+", label: "Landing Pages Built" },
    { value: "200+", label: "Businesses Served" },
    { value: "35+", label: "States Covered" },
    { value: "98%", label: "Client Satisfaction" },
];

const steps = [
    { step: "01", title: "We Analyze Your Business", desc: "We study your services, location, and target customers to craft the perfect page strategy." },
    { step: "02", title: "We Build Your Page", desc: "Our team creates a high-converting, SEO-optimized landing page tailored to your business." },
    { step: "03", title: "You Start Ranking", desc: "Your page goes live and starts attracting local customers searching for your services." },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white font-sans">

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-black text-blue-700">Local</span>
                        <span className="text-2xl font-black text-gray-900">Rankers</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <a href="#about" className="hover:text-blue-600 transition">About</a>
                        <a href="#categories" className="hover:text-blue-600 transition">Categories</a>
                        <a href="#areas" className="hover:text-blue-600 transition">Areas</a>
                        <a href="#how" className="hover:text-blue-600 transition">How It Works</a>
                        <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-28 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-block bg-blue-500 bg-opacity-40 text-blue-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                        🚀 Local SEO & Landing Page Experts
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                        Get Found. Get Called.
                        <br />
                        <span className="text-yellow-300">Grow Your Business.</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                        Local Rankers builds high-converting landing pages that put your business
                        at the top of Google — so local customers find you first, every time.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a href="#contact" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 px-8 rounded-xl transition shadow-lg text-lg">
                            Get Your Free Page Audit
                        </a>
                        <a href="#categories" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-4 px-8 rounded-xl transition text-lg border border-white border-opacity-30">
                            Browse Categories
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-gray-900 py-14">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((s, i) => (
                        <div key={i}>
                            <div className="text-4xl font-black text-yellow-400">{s.value}</div>
                            <div className="text-gray-400 text-sm mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About */}
            <section id="about" className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Who We Are</div>
                        <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                            We Help Local Businesses
                            <span className="text-blue-600"> Dominate</span> Their Market
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-6">
                            Local Rankers is a specialized digital agency focused on one thing — getting local
                            businesses to rank on Google and convert visitors into paying customers.
                        </p>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8">
                            We build SEO-optimized, high-converting landing pages for every city, every service,
                            and every business type. From plumbers in Arkansas to dentists in California —
                            we've helped hundreds of local businesses grow their revenue through search.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {["Local SEO Experts", "Fast Turnaround", "Proven Results", "Transparent Pricing"].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                                    <span className="text-green-500 text-lg">✓</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: "🎯", title: "Hyper-Local Targeting", desc: "Pages built for your exact city and service area" },
                            { icon: "📈", title: "SEO Optimized", desc: "Every page built to rank on Google from day one" },
                            { icon: "💬", title: "Conversion Focused", desc: "Designed to turn visitors into phone calls" },
                            { icon: "⚡", title: "Fast Delivery", desc: "Your page live within 48 hours of onboarding" },
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                                <div className="text-gray-500 text-sm">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Business Categories */}
            <section id="categories" className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">What We Cover</div>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">
                            Business Categories We Serve
                        </h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            We create landing pages for virtually every local business type.
                            Don't see yours? We cover it.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {businessCategories.map((cat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition cursor-default group">
                                <div className="text-3xl mb-3">{cat.icon}</div>
                                <div className="font-bold text-gray-900 group-hover:text-blue-600 transition">{cat.name}</div>
                                <div className="text-gray-400 text-xs mt-1">{cat.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Areas */}
            <section id="areas" className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Where We Work</div>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">
                            Areas We Serve Across the USA
                        </h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            From small towns to major cities — we build landing pages that rank locally, wherever your business is.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {serviceAreas.map((area, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">📍</span>
                                    <h3 className="font-black text-gray-900 text-lg">{area.state}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {area.cities.map((city, j) => (
                                        <span key={j} className="bg-white text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                      {city}
                    </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <p className="text-gray-500">
                            Don't see your area? <a href="#contact" className="text-blue-600 font-semibold hover:underline">Contact us</a> — we cover all 50 states.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how" className="py-24 px-6 bg-blue-700 text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="text-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">The Process</div>
                        <h2 className="text-4xl font-black mb-4">How It Works</h2>
                        <p className="text-blue-200 text-lg max-w-xl mx-auto">
                            Simple, fast, and proven. We handle everything — you just watch the calls come in.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-6xl font-black text-blue-500 mb-4">{s.step}</div>
                                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                                <p className="text-blue-200 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-24 px-6 bg-white">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4">
                        Ready to Rank Higher?
                    </h2>
                    <p className="text-gray-500 text-lg mb-10">
                        Tell us about your business and we'll show you exactly how we can get you more local customers.
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-left space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
                            <input type="text" placeholder="John Smith" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name</label>
                            <input type="text" placeholder="Smith Plumbing LLC" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input type="email" placeholder="john@smithplumbing.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Type & City</label>
                            <input type="text" placeholder="Plumber in Fayetteville, AR" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition shadow-md text-lg">
                            Get My Free Audit →
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <span className="text-2xl font-black text-white">Local</span>
                        <span className="text-2xl font-black text-blue-400">Rankers</span>
                        <p className="text-sm mt-1">Helping local businesses rank & grow.</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <a href="#about" className="hover:text-white transition">About</a>
                        <a href="#categories" className="hover:text-white transition">Categories</a>
                        <a href="#areas" className="hover:text-white transition">Areas</a>
                        <a href="#contact" className="hover:text-white transition">Contact</a>
                    </div>
                    <p className="text-sm">© {new Date().getFullYear()} Local Rankers. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
}