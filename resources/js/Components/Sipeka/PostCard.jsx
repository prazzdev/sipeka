import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { MapPin, ArrowBigUp, Share2, MoreVertical } from 'lucide-react';

export default function PostCard({ report }) {
    const { post, processing } = useForm();

    const handleUpvote = () => {
        post(route('upvote.toggle', report?.id), {
            preserveScroll: true, // Agar saat klik, posisi scroll tidak lompat ke atas
        });
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
                        <p className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                {/* <Link 
                    href={route('laporan.show', report.id)}
                    className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100"
                > */}
                    <button className="text-gray-500"><MoreVertical size={20} /></button>
                {/* </Link> */}
            </div>

            {/* Foto Jalan */}
            <div className="relative aspect-video bg-gray-100">
                <img 
                    src={`/storage/${report.foto_jalan}`} 
                    alt="Kerusakan Jalan" 
                    className="w-full h-full object-cover"
                />
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${
                        report.status === 'selesai' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-blue-900'
                    }`}>
                        {report.status}
                    </span>
                </div>
            </div>

            {/* Content */}
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
                    <button className="flex items-center space-x-1 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
                        <Share2 size={20} />
                        <span className="text-sm">Bagikan</span>
                    </button>
                </div>
            </div>
        </div>
    );
}