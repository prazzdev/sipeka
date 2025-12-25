import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { MapPin, 
    ArrowBigUp, 
    Share2, 
    MoreVertical, 
    Link as LinkIcon, 
    Check,
    AlertTriangle, 
    ExternalLink,
    Trash2, 
    Edit } from 'lucide-react';

export default function PostCard({ report, auth }) {
    const { post, processing } = useForm();
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const shareUrl = `${window.location.origin}/laporan/${report.id}`;
    const shareTitle = `SIPEKA: Mohon perhatian, ada jalan rusak di ${report.lokasi_detail}`;

    const handleUpvote = () => {
        post(route('upvote.toggle', report?.id), {
            preserveScroll: true,
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SIPEKA Madukara',
                    text: shareTitle,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('Batal berbagi:', err);
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini secara permanen?')) {
            router.delete(route('laporan.destroy', report.id), {
                preserveScroll: true,
                onSuccess: () => setShowMenu(false),
            });
        }
    };
    
    return (
        <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
                        {report.user.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900">{report.user.name}</h4>
                        <p className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString('ID','id')}</p>
                    </div>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                        <MoreVertical size={20} className="text-gray-500" />
                    </button>

                    {/* DROPDOWN MENU */}
                    {showMenu && (
                        <>
                            {/* Overlay transparan agar bisa tutup menu saat klik di mana saja */}
                            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                            
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-150">
                                {/* Opsi 1: Lihat Detail */}
                                <Link 
                                    href={route('laporan.show', report.id)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                >
                                    <ExternalLink size={16} className="mr-2" /> Lihat Detail
                                </Link>

                                {/* Opsi 2: Hapus (Hanya muncul untuk pemilik/admin) */}
                                {(auth.user.id === report.user_id || auth.user.role === 'admin') ? (
                                    <button 
                                        onClick={handleDelete}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-50"
                                    >
                                        <Trash2 size={16} className="mr-2" /> Hapus Laporan
                                    </button>
                                ) : (
                                    /* Opsi 3: Laporkan (Jika orang lain) */
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition border-t border-gray-50">
                                        <AlertTriangle size={16} className="mr-2" /> Laporkan Spam
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Link href={route('laporan.show', report?.id)}>
                <div className="relative aspect-video bg-gray-100">
                    <img 
                        src={`/storage/${report.foto_jalan}`} 
                        alt="Kerusakan Jalan" 
                        className="w-full h-full object-cover"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${
                            report.status === 'selesai' ? 'bg-green-500 text-white' : 
                            report.status === 'ditolak' ? 'bg-red-100 text-red-600' :
                            report.status === 'diproses' ? 'bg-blue-500 text-white' :
                            report.status === 'diverifikasi' ? 'bg-indigo-500 text-white' 
                            : 'bg-yellow-400 text-blue-900'
                        }`}>
                            {report.status}
                        </span>
                    </div>
                </div>
            </Link>

            <div className="p-4">
                {/* <h3 className="font-bold text-lg text-blue-900 mb-1">{report.judul_laporan}</h3> */}
                <Link href={route('laporan.show', report?.id)}>
                    <h3 className="font-bold text-lg text-blue-900 mb-1 hover:underline cursor-pointer">
                        {report.judul_laporan}
                    </h3>
                </Link>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin size={14} className="mr-1 text-red-500" />
                    <span className="truncate">{report.lokasi_detail}</span>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                    {report.deskripsi}
                </p>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button 
                        onClick={handleUpvote}
                        disabled={processing}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                            report.upvoted ? 'bg-yellow-100 text-yellow-600' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <ArrowBigUp 
                            size={24} 
                            className={report.upvoted ? 'fill-current' : ''} 
                        />
                        <span className="font-bold">{report.total_upvote} Upvotes</span>
                    </button>
                    <button 
                        onClick={handleShare}
                        className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                        {copied ? (
                            <>
                                <Check size={20} className="text-green-500" />
                                <span className="text-xs font-bold text-green-500">Tersalin!</span>
                            </>
                        ) : (
                            <>
                                <Share2 size={20} />
                                <span className="text-xs font-bold">Bagikan</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}