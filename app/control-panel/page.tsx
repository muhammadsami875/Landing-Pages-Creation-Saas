// app/control-panel/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CPDashboard() {
    const total = await prisma.landingPage.count();
    const published = await prisma.landingPage.count({ where: { published: true } });
    const drafts = total - published;
    const recent = await prisma.landingPage.findMany({ orderBy: { createdAt: "desc" }, take: 6 });

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage all your landing pages</p>
                </div>
                <Link href="/control-panel/pages/create"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl transition flex items-center gap-2">
                    ✨ Create New Page
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-5 mb-8">
                {[
                    { label: "Total Pages", value: total, icon: "📄", color: "text-blue-400", bg: "bg-blue-950/50 border-blue-800" },
                    { label: "Live Pages", value: published, icon: "🟢", color: "text-green-400", bg: "bg-green-950/50 border-green-800" },
                    { label: "Drafts", value: drafts, icon: "✏️", color: "text-yellow-400", bg: "bg-yellow-950/50 border-yellow-800" },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} border rounded-2xl p-6`}>
                        <div className="text-2xl mb-3">{s.icon}</div>
                        <div className={`text-4xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">Recent Pages</h2>
                    <Link href="/control-panel/pages" className="text-blue-400 text-sm hover:underline">View all →</Link>
                </div>

                {recent.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">✨</div>
                        <p className="text-gray-500 mb-5">No pages yet — create your first one!</p>
                        <Link href="/control-panel/pages/create"
                              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition">
                            Create First Page
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recent.map(page => (
                            <div key={page.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition group">
                                <div className="flex items-center gap-4">
                                    {(page as any).logoUrl ? (
                                        <img src={(page as any).logoUrl} alt="" className="w-10 h-10 rounded-lg object-contain bg-white p-1" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-blue-400 font-bold text-lg">
                                            {page.businessName.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-white">{page.businessName}</p>
                                        <p className="text-xs text-blue-400 font-mono mt-0.5">/{page.fullPath}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${page.published ? "bg-green-900 text-green-400" : "bg-yellow-900/60 text-yellow-400"}`}>
                    {page.published ? "Live" : "Draft"}
                  </span>
                                    <Link href={`/control-panel/pages/${page.id}/edit`}
                                          className="text-blue-400 text-sm hover:underline font-medium">Edit</Link>
                                    <Link href={`/${page.fullPath}`} target="_blank"
                                          className="text-gray-500 text-sm hover:text-gray-300">View ↗</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}