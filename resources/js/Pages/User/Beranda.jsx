import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostCard from '@/Components/Sipeka/PostCard';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock, TrendingUp } from 'lucide-react';

export default function Beranda({ auth, reports, filters }) {
    const { processing } = usePage();

    const handleSort = (type) => {
        router.get(route('beranda'), { sort: type }, { 
            preserveState: true, 
            preserveScroll: true 
        });
    };
    
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
                    
                    {/* Filter Sorting */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-xl font-black text-blue-900">Feed Laporan</h2>
                            <p className="text-xs text-gray-500">Pantau kondisi jalan di Madukara</p>
                        </div>

                        <div className="inline-flex bg-gray-200/50 p-1 rounded-2xl backdrop-blur-sm border border-gray-100">
                            <button
                                onClick={() => handleSort('terbaru')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    (!filters.sort || filters.sort === 'terbaru') 
                                    ? 'bg-white text-blue-900 shadow-md ring-1 ring-black/5' 
                                    : 'text-gray-500 hover:text-blue-900 hover:bg-gray-100'
                                }`}
                            >
                                <Clock size={16} className={(!filters.sort || filters.sort === 'terbaru') ? 'text-blue-600' : ''} />
                                Terbaru
                            </button>
                            
                            <button
                                onClick={() => handleSort('populer')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    filters.sort === 'populer' 
                                    ? 'bg-white text-blue-900 shadow-md ring-1 ring-black/5' 
                                    : 'text-gray-500 hover:text-blue-900 hover:bg-gray-100'
                                }`}
                            >
                                <TrendingUp size={16} className={filters.sort === 'populer' ? 'text-orange-500' : ''} />
                                Populer
                            </button>
                        </div>
                    </div>
                    
                    {/* List Postingan */}
                    <div className={`space-y-6 transition-opacity duration-300 ${processing ? 'opacity-50' : 'opacity-100'}`}>
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