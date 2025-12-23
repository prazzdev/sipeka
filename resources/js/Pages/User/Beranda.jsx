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
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <PostCard key={report.id} report={report} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">Belum ada laporan di wilayah Madukara.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}