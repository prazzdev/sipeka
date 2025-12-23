import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, MapPin, Calendar, User, ArrowBigUp, ExternalLink } from 'lucide-react';
import MiniMap from '@/Components/Sipeka/MiniMap';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icon manual agar tidak error/hilang
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function DetailReport({ auth, report }) {
    const { data, setData, post, processing, reset } = useForm({ pesan: '' });
    const position = [report.latitude, report.longitude];

    const submitComment = (e) => {
        e.preventDefault();
        post(route('komentar.store', report.id), {
            onSuccess: () => reset('pesan'),
            preserveScroll: true
        });
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-blue-900 text-xl leading-tight">Detail Laporan</h2>}
        >
            <Head title={`Detail - ${report.judul_laporan}`} />

            <div className="px-4 py-8">
                <div className="mx-auto max-w-4xl">
                    {/* Tombol Kembali */}
                    <Link href={route('beranda')} className="flex items-center mb-4 font-semibold text-blue-900 hover:underline">
                        <ChevronLeft size={20} /> Kembali ke Beranda
                    </Link>

                    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            
                            {/* Sisi Kiri: Foto */}
                            <div className="bg-gray-100 h-64 md:h-auto">
                                <img 
                                    src={`/storage/${report.foto_jalan}`} 
                                    alt={report.judul_laporan} 
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Sisi Kanan: Info Lengkap */}
                            <div className="p-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block ${
                                    report.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    Status: {report.status}
                                </span>

                                <h1 className="mb-2 font-black text-blue-900 text-2xl">{report.judul_laporan}</h1>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <User size={16} className="mr-2" />
                                        <span>Dilaporkan oleh: <strong>{report.user.name}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <Calendar size={16} className="mr-2" />
                                        <span>Tanggal: {new Date(report.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <MapPin size={16} className="mr-2 text-red-500" />
                                        <span>{report.lokasi_detail}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="mb-2 font-bold text-gray-900">Deskripsi Kerusakan:</h4>
                                    <p className="mb-6 text-gray-700 italic leading-relaxed">"{report.deskripsi}"</p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center bg-gray-50 px-4 py-2 border border-gray-100 rounded-xl">
                                        <ArrowBigUp className="mr-2 text-yellow-500" fill={report.upvoted ? "currentColor" : "none"} />
                                        <span className="font-bold text-lg">{report.total_upvote} Upvotes</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bagian Bawah: Lokasi di Peta */}
                        <div className="bg-gray-50 p-6 border-gray-100 border-t">
                            <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-4">
                                <h4 className="flex items-center font-bold text-blue-900 text-sm uppercase tracking-wider">
                                    <MapPin size={18} className="mr-2 text-red-600" /> Titik Lokasi Kerusakan
                                </h4>
                                
                                {/* TOMBOL GOOGLE MAPS */}
                                <a 
                                    href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-white hover:bg-gray-100 shadow-sm px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 text-xs transition"
                                >
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" 
                                        alt="Gmaps" 
                                        className="mr-2 w-4 h-4"
                                    />
                                    Lihat di Google Maps
                                </a>
                            </div>

                            {report.latitude && report.longitude ? (
                                <div className="w-full h-[300px]">
                                    <MiniMap lat={report.latitude} lng={report.longitude} />
                                </div>
                            ) : (
                                <div className="flex justify-center items-center bg-gray-100 rounded-xl h-40 text-gray-400 italic">
                                    Data lokasi tidak tersedia
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bagian Komentar/Admin Response */}
                        <h3 className="flex items-center mb-4 font-bold text-blue-900">
                        Tanggapan Dinas PUPR ({report.comments.length})
                    </h3>

                    {/* List Komentar */}
                    <div className="space-y-4 mb-6">
                        {report.comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 p-4 border border-gray-100 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="flex items-center font-bold text-blue-900 text-sm">
                                        <div className="flex justify-center items-center bg-yellow-400 mr-2 rounded-full w-6 h-6 text-[10px]">
                                            PUPR
                                        </div>
                                        {comment.user.name} 
                                        {comment.user.role !== 'user' && <span className="bg-blue-100 ml-2 px-2 py-0.5 rounded text-[10px] text-blue-600">Official</span>}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.pesan}</p>
                            </div>
                        ))}
                    </div>

                    {/* Form Komentar (Hanya Admin/Kadis) */}
                    {(auth.user.role === 'admin' || auth.user.role === 'kadis') && (
                        <form onSubmit={submitComment} className="mt-4 pt-4 border-t">
                            <textarea
                                className="border-gray-300 focus:border-yellow-500 rounded-xl focus:ring-yellow-500 w-full text-sm"
                                rows="3"
                                placeholder="Tulis tanggapan resmi dinas..."
                                value={data.pesan}
                                onChange={e => setData('pesan', e.target.value)}
                            ></textarea>
                            <button 
                                disabled={processing}
                                className="bg-blue-900 hover:bg-blue-800 mt-2 px-6 py-2 rounded-lg font-bold text-white text-sm transition"
                            >
                                Kirim Tanggapan Resmi
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}