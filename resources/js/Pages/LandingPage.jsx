import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { MapPin, ShieldCheck, MessageSquare, BarChart3, ArrowRight } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function LandingPage({ canLogin, canRegister, auth }) {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Head title="SIPEKA - Sistem Pelaporan Kerusakan Jalan" />

            {/* Navbar */}
            <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 max-w-7xl mx-auto relative z-50">
                <div className="flex items-center gap-2">
                    {/* <div className="bg-blue-900 p-1.5 md:p-2 rounded-lg">
                        <MapPin className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" />
                    </div> */}
                    {/* <span className="text-xl md:text-2xl font-black tracking-tighter text-blue-900">SIPEKA</span> */}
                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    {auth.user ? (
                        <Link 
                            href={route('beranda')} 
                            className="bg-blue-900 hover:bg-blue-800 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg shadow-blue-200"
                        >
                            Ke Beranda
                        </Link>
                    ) : (
                        <>
                            {canLogin && (
                                <Link 
                                    href={route('login')} 
                                    className="text-sm md:text-base font-bold text-gray-600 hover:text-blue-900 transition"
                                >
                                    Masuk
                                </Link>
                            )}
                            {canRegister && (
                                <Link 
                                    href={route('register')} 
                                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-black shadow-lg shadow-yellow-200 transition-all active:scale-95 whitespace-nowrap"
                                >
                                    Daftar
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-sm font-bold text-blue-900 uppercase tracking-widest">Kecamatan Madukara</span>
                    </div>
                    {/* <h1 className="text-4xl md:text-6xl font-black leading-tight text-blue-900">
                        Suarakan Kerusakan, <span className="text-yellow-500 underline decoration-blue-900 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">Wujudkan</span> Jalan Mulus.
                    </h1> */}
                    <h1 className="text-4xl md:text-6xl font-black leading-tight text-blue-900">
                        Sistem Informasi Pelaporan <span className="text-yellow-500 underline decoration-blue-900 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">Kerusakan Jalan</span>.
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                        SIPEKA hadir untuk mempercepat pelaporan kerusakan jalan di Kecamatan Madukara secara transparan berbasis GIS. Bantu Dinas PUPR memetakan prioritas perbaikan dengan satu genggaman.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        {auth.user ? (
                            <Link 
                                href={route('beranda')} 
                                className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition shadow-xl shadow-blue-200"
                            >
                                Masuk ke Aplikasi <ArrowRight size={20} />
                            </Link>
                        ) : (
                            <>
                                <Link 
                                    href={route('laporan.create')} 
                                    className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition shadow-xl shadow-blue-200"
                                >
                                    Laporkan Sekarang <ArrowRight size={20} />
                                </Link>
                                <Link 
                                    href={route('peta.index')} 
                                    className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition"
                                >
                                    Lihat Peta
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Ilustrasi/Preview Aplikasi */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-yellow-400 rounded-[2rem] rotate-3 opacity-20"></div>
                    <div className="relative bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden border-8 border-gray-800 h-[500px]">
                        {/* Di sini bisa Anda ganti dengan screenshot aplikasi / Peta Anda */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/40 flex items-center justify-center p-12 text-center">
                            <div className="space-y-4">
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                    <div className="flex gap-2 mb-4">
                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    </div>
                                    <div className="h-4 w-48 bg-white/20 rounded mb-2"></div>
                                    <div className="h-4 w-32 bg-white/10 rounded"></div>
                                </div>
                                <p className="text-white font-black text-2xl uppercase tracking-widest italic">Dashboard GIS Sipeka</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="bg-blue-900 py-24 px-8 mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-yellow-400 font-black uppercase tracking-widest">Fitur Utama</h2>
                        <h3 className="text-4xl font-black text-white">Bagaimana SIPEKA Bekerja?</h3>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <FeatureCard icon={<MapPin className="text-blue-900" />} title="Pemetaan GIS" desc="Laporan warga otomatis terpetakan di titik koordinat yang akurat." />
                        <FeatureCard icon={<ShieldCheck className="text-blue-900" />} title="Verifikasi Dinas" desc="Admin memverifikasi laporan untuk memastikan data valid." />
                        <FeatureCard icon={<BarChart3 className="text-blue-900" />} title="Prioritas Upvote" desc="Jalan dengan vote terbanyak diprioritaskan untuk perbaikan." />
                        <FeatureCard icon={<MessageSquare className="text-blue-900" />} title="Update Progres" desc="Lihat tanggapan resmi dari dinas beserta foto perbaikan." />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 text-center">
                <p className="text-gray-400 text-sm">
                    &copy; 2025 SIPEKA Madukara. Projek Skripsi Teknik Informatika.
                </p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-white p-8 rounded-3xl space-y-4 transform hover:-translate-y-2 transition duration-300 shadow-xl shadow-black/10">
            <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {icon}
            </div>
            <h4 className="font-black text-xl text-blue-900">{title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}