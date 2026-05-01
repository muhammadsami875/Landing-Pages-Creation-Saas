// app/control-panel/pages/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CPPagesList() {
    const pages = await prisma.landingPage.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">All Pages</h1>
                    <p className="text-gray-500 text-sm mt-1">{pages.length} total pages</p>
                </div>
                <Link href="/control-panel/pages/create"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl transition flex items-center gap-2">
                    ✨ Create New Page
                </Link>
            </div>

            {pages.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-20 text-center">
                    <div className="text-5xl mb-4">✨</div>
                    <p className="text-gray-400 text-lg mb-5">No pages created yet</p>
                    <Link href="/control-panel/pages/create"
                          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition">
                        Create First Page
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-800 bg-gray-800/50">
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Business</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Page URL</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Location</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pages.map((page, i) => (
                            <tr key={page.id} className={`border-b border-gray-800/40 hover:bg-gray-800/30 transition ${i === pages.length - 1 ? "border-0" : ""}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {page.logoUrl ? (
                                            <img src={page.logoUrl} alt="" className="w-9 h-9 rounded-lg object-contain bg-white p-0.5" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-blue-300 font-bold text-sm">
                                                {page.businessName.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-white text-sm">{page.businessName}</div>
                                            <div className="text-xs text-gray-500">{new Date(page.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-blue-400 font-mono text-xs bg-blue-950/50 px-2 py-1 rounded">/{page.fullPath}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-300 text-sm">{page.city}, {page.state}</td>
                                <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${page.published ? "bg-green-900/60 text-green-400" : "bg-yellow-900/40 text-yellow-400"}`}>
                      {page.published ? "🟢 Live" : "✏️ Draft"}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <Link href={`/control-panel/pages/${page.id}/edit`} className="text-blue-400 text-sm hover:underline font-medium">Edit</Link>
                                        <Link href={`/${page.fullPath}`} target="_blank" className="text-gray-500 text-sm hover:text-gray-300">View ↗</Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}