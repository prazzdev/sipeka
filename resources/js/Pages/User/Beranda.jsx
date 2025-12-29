import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostCard from '@/Components/Sipeka/PostCard';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock, TrendingUp, Search, X } from 'lucide-react'; // Tambah Search & X

export default function Beranda({ auth, reports, filters }) {
    const { processing } = usePage();

    // Fungsi untuk handle pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        const value = e.target.search.value;
        router.get(route('beranda'), 
            { ...filters, search: value }, // Gabungkan dengan filter sort yang ada
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    // Fungsi untuk handle sort
    const handleSort = (type) => {
        router.get(route('beranda'), 
            { ...filters, sort: type }, // Gabungkan dengan filter search yang ada
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const clearSearch = () => {
        router.get(route('beranda'), { sort: filters.sort }, { replace: true });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-xl text-blue-900 leading-tight">Beranda SIPEKA</h2>}
        >
            <Head title="Beranda" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tombol Lapor Cepat */}
                    <div className="bg-blue-900 rounded-xl p-6 mb-6 shadow-lg text-white flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-white">Ada jalan rusak?</h3>
                            <p className="text-blue-100 text-sm">Laporkan segera untuk Banjarnegara yang lebih baik.</p>
                        </div>
                        <Link 
                            href="/laporan/buat" 
                            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-full transition shadow-md whitespace-nowrap"
                        >
                            Lapor!
                        </Link>
                    </div>

                    {/* Fitur Search Baru */}
                    <div className="mb-8">
                        <form onSubmit={handleSearch} className="relative group">
                            <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-900 transition-colors" size={20} />
                            <input 
                                name="search"
                                type="text"
                                defaultValue={filters.search}
                                placeholder="Cari laporan atau lokasi..."
                                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-900 transition bg-white"
                            />
                            {filters.search && (
                                <button 
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-4 top-3.5 text-gray-400 hover:text-red-500"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </form>
                    </div>
                    
                    {/* Filter Sorting */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-xl font-black text-blue-900">Feed Laporan</h2>
                            <p className="text-xs text-gray-500">
                                {filters.search ? `Menampilkan pencarian "${filters.search}"` : 'Pantau kondisi jalan di Madukara'}
                            </p>
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
                                <Clock size={16} />
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
                                <TrendingUp size={16} />
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
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Search size={40} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-900 font-bold">Laporan tidak ditemukan</p>
                                <p className="text-gray-500 text-sm mt-1">Coba gunakan kata kunci lain atau jadilah yang pertama melapor!</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-wrap justify-center items-center gap-1">
                        {reports.links && reports.links.map((link, k) => (
                            link.url === null ? (
                                <span key={k} dangerouslySetInnerHTML={{ __html: link.label }} className="px-4 py-2 text-sm rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed"/>
                            ) : (
                                <Link
                                    key={k}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                        link.active ? 'bg-blue-900 text-white border-blue-900 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:text-blue-900'
                                    }`}
                                    preserveScroll
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}