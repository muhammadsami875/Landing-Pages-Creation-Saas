// components/CPSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { JWTPayload } from "@/lib/jwt";

export default function CPSidebar({ user }: { user: JWTPayload }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        toast.success("Logged out");
        router.push("/control-panel/login");
        router.refresh();
    };

    const nav = [
        { href: "/control-panel",                label: "Dashboard",       icon: "🏠", exact: true  },
        { href: "/control-panel/pages",          label: "All Pages",       icon: "📄", exact: false },
        { href: "/control-panel/pages/create",   label: "Create Page",     icon: "✨", exact: false },
        { href: "/control-panel/register",       label: "Add Admin",       icon: "👤", exact: false },
    ];

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href) && pathname !== "/control-panel";

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-40">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <div className="text-xl font-black text-white">
                    Local<span className="text-blue-400">Rankers</span>
                </div>
                <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">Control Panel</div>
                <div className="mt-4 flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-400 truncate">{user.email}</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {nav.map(item => (
                    <Link key={item.href} href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              isActive(item.href, item.exact)
                                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          }`}>
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Bottom */}
            <div className="p-4 space-y-1 border-t border-gray-800">
                <Link href="/" target="_blank"
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition">
                    <span>🌐</span> View Website
                </Link>
                <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-950 transition">
                    <span>🚪</span> Sign Out
                </button>
            </div>
        </aside>
    );
}