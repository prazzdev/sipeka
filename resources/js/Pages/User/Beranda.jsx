import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostCard from '@/Components/Sipeka/PostCard';
import { Head, Link } from '@inertiajs/react';

export default function Beranda({ auth, reports }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-xl text-blue-900 leading-tight">Beranda SIPEKA</h2>}
        >
            <Head title="Beranda" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tombol Lapor Cepat (khusus user) */}
                    <div className="bg-blue-900 rounded-xl p-6 mb-8 shadow-lg text-white flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">Ada jalan rusak?</h3>
                            <p className="text-blue-100 text-sm">Laporkan segera untuk Banjarnegara yang lebih baik.</p>
                        </div>
                        <Link 
                            href="/laporan/buat" 
                            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-full transition shadow-md"
                        >
                            Lapor!
                        </Link>
                    </div>

                    {/* List Postingan */}
                    <div className="space-y-6">
                        {reports.data.length > 0 ? (
                            reports.data.map((report) => (
                                <PostCard key={report.id} report={report} auth={auth} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                                <p className="text-gray-500 font-medium">Belum ada laporan saat ini.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center items-center gap-1">
                        {reports.links && reports.links.map((link, k) => (
                            link.url === null ? (
                                // Gunakan span jika URL null agar tidak error .toString()
                                <span
                                    key={k}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className="px-4 py-2 text-sm rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed"
                                />
                            ) : (
                                // Gunakan Link hanya jika URL tersedia
                                <Link
                                    key={k}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                        link.active 
                                            ? 'bg-blue-900 text-white border-blue-900 font-bold shadow-sm' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-900 hover:text-blue-900'
                                    }`}
                                    preserveScroll // Sangat disarankan agar posisi scroll tidak lompat
                                />
                            )
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        Menampilkan {reports.from} sampai {reports.to} dari total {reports.total} laporan.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}