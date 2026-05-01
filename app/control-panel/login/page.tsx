// app/control-panel/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ControlPanelLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok || data.user?.role !== "ADMIN") {
                toast.error("Access denied");
                return;
            }
            toast.success("Welcome!");
            router.push("/control-panel");
            router.refresh();
        } catch { toast.error("Something went wrong"); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <div className="text-3xl font-black text-white mb-1">
                        Local<span className="text-blue-400">Rankers</span>
                    </div>
                    <p className="text-gray-600 text-xs tracking-widest uppercase mt-2">Control Panel</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">Email</label>
                            <input type="email" required autoComplete="off"
                                   className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="admin@localrankers.com"
                                   value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">Password</label>
                            <input type="password" required
                                   className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="••••••••"
                                   value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <button type="submit" disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 mt-2">
                            {loading ? "Verifying..." : "Access Control Panel →"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}