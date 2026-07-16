import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    MapPin,
    ShieldCheck,
    MessageSquare,
    BarChart3,
    ArrowRight,
    ChevronRight,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createCustomIcon = (status) => {
    let colorClass = "bg-blue-500";
    if (status?.toLowerCase() === "selesai") colorClass = "bg-green-500";
    if (status?.toLowerCase() === "diproses") colorClass = "bg-orange-500";
    if (status?.toLowerCase() === "ditolak") colorClass = "bg-red-500";
    if (status?.toLowerCase() === "diverifikasi") colorClass = "bg-blue-600";

    return L.divIcon({
        className: "custom-div-icon",
        html: `<div class="w-5 h-5 ${colorClass} rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
               </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

export default function LandingPage({
    canLogin,
    canRegister,
    auth,
    reports = [],
}) {
    const { server_time } = usePage().props;
    const [loadTime, setLoadTime] = useState(0);
    const centerMadukara = [-7.3891, 109.7185];

    useEffect(() => {
        const now = new Date().getTime();
        const diff = Math.abs((now - server_time) / 1000);
        setLoadTime(diff.toFixed(3));
    }, [server_time]);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Head title="SIPEKA - Sistem Pelaporan Kerusakan Jalan" />

            {/* Navbar */}
            <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 max-w-7xl mx-auto relative z-50">
                <div className="flex items-center gap-2">
                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    {auth.user ? (
                        <Link
                            href={route("beranda")}
                            className="bg-blue-900 hover:bg-blue-800 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg shadow-blue-200"
                        >
                            Ke Beranda
                        </Link>
                    ) : (
                        <>
                            {canLogin && (
                                <Link
                                    href={route("login")}
                                    className="text-sm md:text-base font-bold text-gray-600 hover:text-blue-900 transition"
                                >
                                    Masuk
                                </Link>
                            )}
                            {canRegister && (
                                <Link
                                    href={route("register")}
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
                        <span className="text-sm font-bold text-blue-900 uppercase tracking-widest">
                            Kecamatan Madukara
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight text-blue-900">
                        Sistem Informasi Pelaporan{" "}
                        <span className="text-yellow-500 underline decoration-blue-900 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">
                            Kerusakan Jalan
                        </span>
                        .
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                        SIPEKA hadir untuk mempercepat pelaporan kerusakan jalan
                        di Kecamatan Madukara secara transparan berbasis GIS.
                        Bantu Dinas PUPR memetakan prioritas perbaikan dengan
                        satu genggaman.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        {auth.user ? (
                            <Link
                                href={route("beranda")}
                                className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition shadow-xl shadow-blue-200"
                            >
                                Masuk ke Aplikasi <ArrowRight size={20} />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("laporan.create")}
                                    className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition shadow-xl shadow-blue-200"
                                >
                                    Laporkan Sekarang <ArrowRight size={20} />
                                </Link>
                                <Link
                                    href={route("peta.index")}
                                    className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition"
                                >
                                    Lihat Peta
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* MODIFIKASI: Peta Interaktif Sebaran Laporan GIS */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-yellow-400 rounded-[2rem] rotate-3 opacity-20"></div>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-gray-900 h-[500px] flex flex-col">
                        {/* Header Mockup Aplikasi */}
                        <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800 shrink-0">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                                <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
                                PETA SEBARAN LAPORAN JALAN KEC. MADUKARA (LIVE)
                            </span>
                            <div className="w-8"></div>
                        </div>

                        {/* Kontainer Utama Peta */}
                        <div className="flex-1 w-full relative z-10">
                            <MapContainer
                                center={centerMadukara}
                                zoom={12}
                                scrollWheelZoom={false}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution="&copy; OpenStreetMap"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {reports.map((report) => (
                                    <Marker
                                        key={`landing-${report.id}`}
                                        position={[
                                            report.latitude,
                                            report.longitude,
                                        ]}
                                        icon={createCustomIcon(report.status)}
                                    >
                                        <Popup>
                                            <div className="w-40 p-0.5 font-sans">
                                                <div className="mb-1.5">
                                                    <span
                                                        className={`text-[7px] font-black px-1.5 py-0.5 rounded text-white uppercase tracking-wider ${
                                                            report.status ===
                                                            "selesai"
                                                                ? "bg-green-500"
                                                                : report.status ===
                                                                    "diproses"
                                                                  ? "bg-orange-500"
                                                                  : report.status ===
                                                                      "ditolak"
                                                                    ? "bg-red-500"
                                                                    : "bg-blue-500"
                                                        }`}
                                                    >
                                                        {report.status}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-blue-900 text-xs leading-tight mb-0.5 truncate">
                                                    {report.judul_laporan}
                                                </h3>
                                                <p className="text-[9px] text-gray-500 mb-2 truncate">
                                                    {report.lokasi_detail}
                                                </p>
                                                <Link
                                                    href={route(
                                                        "laporan.show",
                                                        report.id,
                                                    )}
                                                    className="flex items-center justify-center bg-blue-900 !text-white py-1 rounded text-[9px] font-bold hover:bg-blue-800 transition uppercase no-underline w-full"
                                                >
                                                    Detail{" "}
                                                    <ChevronRight
                                                        size={10}
                                                        className="ml-0.5"
                                                    />
                                                </Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="bg-blue-900 py-24 px-8 mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-yellow-400 font-black uppercase tracking-widest">
                            Fitur Utama
                        </h2>
                        <h3 className="text-4xl font-black text-white">
                            Bagaimana SIPEKA Bekerja?
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <FeatureCard
                            icon={<MapPin className="text-blue-900" />}
                            title="Pemetaan GIS"
                            desc="Laporan warga otomatis terpetakan di titik koordinat yang akurat."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="text-blue-900" />}
                            title="Verifikasi Dinas"
                            desc="Admin memverifikasi laporan untuk memastikan data valid."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-blue-900" />}
                            title="Prioritas Upvote"
                            desc="Jalan dengan vote terbanyak diprioritaskan untuk perbaikan."
                        />
                        <FeatureCard
                            icon={<MessageSquare className="text-blue-900" />}
                            title="Update Progres"
                            desc="Lihat tanggapan resmi dari dinas beserta foto perbaikan."
                        />
                    </div>
                </div>
            </section>

            {/* Footer Baru */}
            <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        {/* Kolom 1 */}
                        <div className="space-y-4 text-center md:text-left">
                            <ApplicationLogo className="h-10 w-auto fill-current text-blue-900 mx-auto md:mx-0" />
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Platform digital pelaporan kerusakan jalan untuk
                                transparansi dan percepatan pembangunan
                                infrastruktur di wilayah Kecamatan Madukara.
                            </p>
                        </div>

                        {/* Kolom 2 */}
                        <div className="text-center md:text-left">
                            <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-4">
                                Navigasi
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-600 font-bold">
                                <li>
                                    <Link
                                        href={route("peta.index")}
                                        className="hover:text-blue-900 transition"
                                    >
                                        Peta Kerusakan
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("login")}
                                        className="hover:text-blue-900 transition"
                                    >
                                        Masuk ke Sistem
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Kolom 3 */}
                        <div className="text-center md:text-left">
                            <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-4">
                                Lokasi Pelayanan
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                Jl. May.Jend. Panjaitan No. 8<br />
                                Telp. (0286) 591011 Fak. 591298
                                <br />
                                Banjarnegara, Jawa Tengah
                            </p>
                        </div>
                    </div>

                    {/* Baris Paling Bawah */}
                    <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                &copy; 2026 SIPEKA Madukara. Projek Skripsi
                                Teknik Informatika.
                            </p>
                            <p className="text-[9px] text-gray-300 font-mono italic">
                                Response Time: {loadTime}s
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-900 font-black text-[10px]">
                                TI
                            </div>
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-700 font-black text-[10px]">
                                GIS
                            </div>
                        </div>
                    </div>
                </div>
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
