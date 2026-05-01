// app/control-panel/layout.tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import CPSidebar from "@/components/CPSidebar";

export default async function CPLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    // ── Login page: never wrap with sidebar, never redirect ──
    // The middleware handles login page separately
    // Layout only adds sidebar for authenticated pages
    if (!user || user.role !== "ADMIN") {
        // Don't redirect here — middleware already handles it
        // Just render children without sidebar (login page renders itself)
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-950 flex">
            <CPSidebar user={user} />
            <main className="flex-1 ml-64 p-8 min-h-screen">{children}</main>
        </div>
    );
}