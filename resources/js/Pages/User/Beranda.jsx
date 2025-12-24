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

                    {/* <div className="mt-8 flex justify-center gap-1">
                        {reports.links.map((link, k) => (
                            <Link
                                key={k}
                                href={link?.url}
                                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                                    link?.active 
                                        ? 'bg-blue-900 text-white font-bold' 
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border'
                                } ${!link.url ? 'hidden' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link?.label }}
                            />
                        ))}
                    </div> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}