import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, Camera, MapPin, Send, CheckCircle, Info } from 'lucide-react';

export default function LangkahMelapor({ auth }) {
    const steps = [
        {
            title: "Cari Terlebih Dahulu",
            desc: "Gunakan fitur cari di Beranda untuk memastikan lubang jalan tersebut belum dilaporkan oleh orang lain.",
            icon: <Search className="text-blue-600" size={32} />,
            color: "bg-blue-50"
        },
        {
            title: "Ambil Foto Jelas",
            desc: "Ambil foto kerusakan jalan di lokasi. Pastikan foto terlihat jelas agar admin mudah melakukan verifikasi.",
            icon: <Camera className="text-orange-600" size={32} />,
            color: "bg-orange-50"
        },
        {
            title: "Tentukan Lokasi GPS",
            desc: "Gunakan fitur 'GPS Saat Ini' atau pilih langsung titik koordinat pada peta yang tersedia.",
            icon: <MapPin className="text-red-600" size={32} />,
            color: "bg-red-50"
        },
        {
            title: "Isi Deskripsi Detail",
            desc: "Ceritakan detail kerusakan dan patokan lokasi agar tim teknis lapangan mudah menemukan titiknya.",
            icon: <Info className="text-emerald-600" size={32} />,
            color: "bg-emerald-50"
        },
        {
            title: "Kirim & Pantau",
            desc: "Klik tombol kirim. Anda dapat memantau progres laporan melalui linimasa tanggapan admin.",
            icon: <Send className="text-blue-900" size={32} />,
            color: "bg-blue-100"
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-xl text-blue-900">Cara Melapor</h2>}
        >
            <Head title="Langkah Melapor" />

            <div className="py-12 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-blue-900 mb-4 text-balance">Bantu Kami Memperbaiki Jalan Madukara</h1>
                    <p className="text-gray-600">Ikuti langkah-langkah di bawah ini untuk melaporkan kerusakan jalan dengan benar.</p>
                </div>

                <div className="grid gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-6 items-start bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className={`flex-shrink-0 w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center font-black text-2xl`}>
                                {step.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    <span className="text-blue-900 mr-2">{index + 1}.</span>
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-blue-900 p-8 rounded-3xl text-white text-center shadow-xl">
                    <CheckCircle className="mx-auto mb-4 text-yellow-400" size={48} />
                    <h2 className="text-2xl font-bold mb-2">Sudah Siap Melapor?</h2>
                    <p className="mb-6 text-blue-100">Pastikan Anda berada di lokasi saat mengambil foto untuk akurasi GPS.</p>
                    <Link
                        href={route('laporan.create')}
                        className="inline-block bg-yellow-400 text-blue-900 font-black py-3 px-10 rounded-full hover:bg-yellow-500 transition shadow-lg"
                    >
                        Mulai Lapor Sekarang
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}