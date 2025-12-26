import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm,usePage } from '@inertiajs/react';
import { ChevronLeft, MapPin, Calendar, User, ArrowBigUp, ExternalLink, Camera, Trash2 } from 'lucide-react';
import MiniMap from '@/Components/Sipeka/MiniMap';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { comment } from 'postcss';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function DetailReport({ auth, report }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({ 
        pesan: '',
        foto_tanggapan: null
     });
    const position = [report.latitude, report.longitude];
    const [previewImage, setPreviewImage] = React.useState(null);

    const submitComment = (e) => {
        e.preventDefault();
        post(route('komentar.store', report.id), {
            onSuccess: () => {
                reset('pesan', 'foto_tanggapan');
                setPreviewImage(null);
                document.getElementById('foto_tanggapan').value = "";
            },
            preserveScroll: true
        });
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('foto_tanggapan', file);
        
        if (file) {
            setPreviewImage(URL.createObjectURL(file)); // Buat URL sementara untuk preview
        }
    };
    
    return (

        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-blue-900 text-xl leading-tight">Detail Laporan</h2>}
        >
            <Head title={`${report?.judul_laporan} - SIPEKA`} />
            <Head>
                {/* <title>{report?.judul_laporan} - SIPEKA</title> */}
                <meta property="og:title" content={report?.judul_laporan} />
                <meta property="og:description" content={report?.lokasi_detail} />
                <meta property="og:image" content={`/storage/${report?.foto_jalan}`} />
            </Head>

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
                                {report.foto_jalan !== null ? (
                                    <img 
                                        src={`/storage/${report.foto_jalan}`} 
                                        alt={report.judul_laporan} 
                                        className="w-full h-full object-cover"
                                    />
                                ): (
                                    <img 
                                        src={`/storage/no-image.png`} 
                                        alt={report.judul_laporan} 
                                        className="w-full h-full object-cover"
                                    />
                                )}
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

                    {flash?.message && (
                        <div className="bg-green-100 mb-4 px-4 py-3 border border-green-400 rounded-xl font-bold text-green-700 text-sm animate-fade-in-down">
                            {flash?.message}
                        </div>
                    )}
                    
                    {/* Bagian Komentar/Admin Response */}
                        <h3 className="flex items-center mb-4 font-bold text-blue-900">
                        Tanggapan Dinas PUPR ({report.comments.length})
                    </h3>

                    {/* List Komentar */}
                    {/* <div className="space-y-4 mb-6">
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
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-[10px] text-gray-400">
                                            {new Date(comment.created_at).toLocaleDateString('id-ID')} • {new Date(comment.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                        </span>
                                        
                                        {(auth.user.id === comment.user_id || auth.user.role === 'admin') && (
                                            <button
                                                onClick={() => {
                                                    if(confirm('Hapus tanggapan ini?')) {
                                                        router.delete(route('komentar.destroy', comment.id), {
                                                            preserveScroll: true
                                                        });
                                                    }
                                                }}
                                                className="opacity-100 p-1 text-red-400 hover:text-red-600 transition"
                                                title="Hapus Tanggapan"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.pesan}</p>

                                {comment.foto_tanggapan && (
                                    <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                                        <img 
                                            src={`/storage/${comment.foto_tanggapan}`} 
                                            alt="Foto Progres" 
                                            className="hover:opacity-90 w-full max-h-60 object-cover cursor-pointer"
                                            onClick={() => window.open(`/storage/${comment.foto_tanggapan}`, '_blank')}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div> */}
                    <div className="space-y-4 mt-6 ml-2 max-sm:-ml-1 pl-4 border-gray-100 border-l-2">
                        <h4 className="mb-7 font-black text-gray-400 text-xs uppercase tracking-widest">Histori Progres</h4>
                        
                        {report?.comments?.map((comment, index) => {
                            const dotColor = getStatusColor(comment?.status);
                            
                            return (
                                <div key={comment.id} className="relative mb-8 last:mb-0 ml-3 max-sm:-ml-2 pl-8 max-sm:pl-4 border-gray-400 border-l-2">
                                    <div className={`absolute -left-[9px] -top-4 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-colors duration-500 ${dotColor}`}></div>
                                    
                                    <div className={`bg-white p-4 rounded-2xl border transition-all shadow-sm hover:shadow-md ${
                                        comment.pesan.includes('ditolak') ? 'border-red-100' : 
                                        comment.pesan.includes('selesai') ? 'border-green-100' : 'border-gray-100'
                                    }`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${
                                                dotColor.replace('bg-', 'text-').replace('500', '700')
                                            } ${dotColor.replace('500', '100')}`}>
                                                {comment.status?.split(']')[0].replace('[Status: ', '')}
                                            </span>
                                            <span className="font-medium text-[10px] text-gray-400">
                                                {new Date(comment.created_at).toLocaleDateString('ID-id')} • {new Date(comment.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                            </span>
                                        </div>

                                        <p className="mb-3 text-gray-600 text-sm leading-relaxed">
                                            {comment.pesan.split(']')[1] || comment.pesan}
                                        </p>
                                        
                                        {comment.foto_tanggapan && (
                                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                                                <img 
                                                    src={`/storage/${comment.foto_tanggapan}`} 
                                                    alt="Bukti Progres"
                                                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* {(auth.user.role === 'admin' || auth.user.role === 'kadis') && (
                        <form onSubmit={submitComment} className="mt-4 pt-4 border-t">
                            <textarea
                                className="border-gray-300 focus:border-yellow-500 rounded-xl focus:ring-yellow-500 w-full text-sm"
                                rows="3"
                                placeholder="Tulis tanggapan resmi dinas..."
                                value={data.pesan}
                                onChange={e => setData('pesan', e.target.value)}
                            ></textarea>
                            
                            <div className="mt-4">
                                <label className="block mb-2 font-bold text-gray-700 text-xs uppercase">
                                    Sertakan Foto Progres (Opsional)
                                </label>
                                
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        id="foto_tanggapan"
                                        className="hidden" // Sembunyikan input asli
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    
                                    <label 
                                        htmlFor="foto_tanggapan"
                                        className="group flex flex-col justify-center items-center bg-gray-50 hover:bg-yellow-50 border-2 border-gray-300 hover:border-yellow-400 border-dashed rounded-xl w-full h-32 transition cursor-pointer"
                                    >
                                        {previewImage ? (
                                            <div className="relative p-2 w-full h-full">
                                                <img 
                                                    src={previewImage} 
                                                    className="rounded-lg w-full h-full object-cover" 
                                                    alt="Preview" 
                                                />
                                                <div className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg font-bold text-white text-xs transition">
                                                    Ganti Foto
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                                <Camera className="mb-2 w-8 h-8 text-gray-400 group-hover:text-yellow-500 transition" />
                                                <p className="font-medium text-gray-500 text-xs">
                                                    <span className="font-bold text-blue-900">Klik untuk upload</span> atau drag and drop
                                                </p>
                                                <p className="mt-1 text-[10px] text-gray-400 uppercase">PNG, JPG (Max 2MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button 
                                disabled={processing}
                                className="bg-blue-900 hover:bg-blue-800 mt-2 px-6 py-2 rounded-lg font-bold text-white text-sm transition"
                            >
                                Kirim Tanggapan Resmi
                            </button>
                        </form>
                    )} */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const getStatusColor = (status) => {
    if (status?.includes('ditolak')) return 'bg-red-500';
    if (status?.includes('selesai')) return 'bg-green-500';
    if (status?.includes('diproses')) return 'bg-orange-500'; 
    if (status?.includes('diverifikasi')) return 'bg-blue-500';
    if (status?.includes('menunggu')) return 'bg-blue-500';
    return 'bg-gray-400'; 
};