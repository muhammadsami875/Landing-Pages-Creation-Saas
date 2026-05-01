// app/control-panel/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ControlPanelRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    role: "ADMIN",
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Registration failed");
                return;
            }
            toast.success("Admin account created!");
            router.push("/control-panel");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Create Admin Account</h1>
                    <p className="text-gray-500 mt-1 text-sm">Add a new admin user to the control panel</p>
                </div>
                <Link href="/control-panel"
                      className="text-gray-400 hover:text-white text-sm transition">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="max-w-md">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="newadmin@localrankers.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Min 8 characters"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                                value={form.confirmPassword}
                                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Admin Account"}
                        </button>
                    </form>
                </div>

                <div className="mt-4 bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4">
                    <p className="text-yellow-400 text-xs font-medium">
                        ⚠️ This page is only accessible to logged-in admins. New accounts created here will have full admin access.
                    </p>
                </div>
            </div>
        </div>
    );
}