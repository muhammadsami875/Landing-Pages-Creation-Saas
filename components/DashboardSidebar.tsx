// components/DashboardSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { JWTPayload } from "@/lib/jwt";

interface Props {
    user: JWTPayload;
}

export default function DashboardSidebar({ user }: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        toast.success("Logged out");
        router.push("/login");
        router.refresh();
    };

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: "🏠" },
        { href: "/dashboard/pages", label: "My Pages", icon: "📄" },
        { href: "/dashboard/pages/create", label: "Create Page", icon: "➕" },
        ...(user.role === "ADMIN"
            ? [
                { href: "/dashboard/admin/users", label: "Users", icon: "👥" },
                { href: "/dashboard/admin/pages", label: "All Pages", icon: "📋" },
            ]
            : []),
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    LandingCraft
                </Link>
                <div className="mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-gray-500 truncate">{user.email}</span>
                </div>
                <span className="inline-block mt-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">
          {user.role.toLowerCase()}
        </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
                >
                    <span>🚪</span>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}