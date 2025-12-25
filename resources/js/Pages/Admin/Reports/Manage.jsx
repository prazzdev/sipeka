import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Edit2, Trash2, Save, X } from 'lucide-react';

export default function Manage({ auth, report }) {
    // State untuk melacak komentar mana yang sedang diedit
    const [editingId, setEditingId] = useState(null);
    const { data, setData, patch, delete: destroy, processing } = useForm({
        pesan: '',
    });

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setData('pesan', comment.pesan);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setData('pesan', '');
    };

    const updateComment = (id) => {
        patch(route('admin.comment.update', id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const deleteComment = (id) => {
        if (confirm('Hapus komentar ini dari histori?')) {
            destroy(route('admin.comment.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Kelola Histori" />
            <div className="py-12 max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
                    <h3 className="font-bold text-lg text-blue-900 mb-2">{report.judul_laporan}</h3>
                    <p className="text-gray-500 text-sm">{report.lokasi_detail}</p>
                </div>

                <div className="space-y-6">
                    {report.comments.map((comment) => {
                        const styles = getStatusStyles(comment.status);
                        
                        return (
                            <div key={comment.id} className="relative pl-8 border-l-2 border-gray-100 ml-3">
                                {/* Dot Indikator Warna */}
                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${styles.dot}`}></div>
                                
                                <div className={`p-5 rounded-2xl border transition-all bg-white border-white/50 shadow-sm`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            {/* Label Status dengan Warna Teks Sesuai */}
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-white shadow-sm ${styles.text}`}>
                                                {styles.label}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium italic">
                                                {new Date(comment.created_at).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        
                                        {/* Tombol Aksi (Edit & Hapus) */}
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => startEdit(comment)}
                                                className="p-2 text-blue-600 hover:bg-white rounded-lg transition shadow-sm bg-white/50"
                                            >
                                                <Edit2 size={14}/>
                                            </button>
                                            <button 
                                                onClick={() => deleteComment(comment.id)}
                                                className="p-2 text-red-600 hover:bg-white rounded-lg transition shadow-sm bg-white/50"
                                            >
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Konten Pesan */}
                                    {editingId === comment.id ? (
                                        <div className="space-y-3">
                                            <textarea 
                                                className="w-full border-gray-200 rounded-xl focus:ring-blue-900 focus:border-blue-900 text-sm"
                                                value={data.pesan}
                                                onChange={e => setData('pesan', e.target.value)}
                                                rows="3"
                                            />
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => updateComment(comment.id)} 
                                                    className="bg-blue-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-800"
                                                >
                                                    Simpan Perubahan
                                                </button>
                                                <button 
                                                    onClick={cancelEdit} 
                                                    className="bg-white text-gray-600 px-4 py-1.5 rounded-lg text-xs font-bold border border-gray-200"
                                                >
                                                    Batal
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-700 leading-relaxed italic">
                                                "{comment.pesan}"
                                            </p>
                                            
                                            {comment.foto_tanggapan && (
                                                <div className="mt-4 relative group w-full sm:w-1/2">
                                                    <img 
                                                        src={`/storage/${comment.foto_tanggapan}`} 
                                                        className="rounded-xl border-2 border-white shadow-sm object-cover h-32 w-full"
                                                        alt="Bukti Progres"
                                                    />
                                                    <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-md text-white opacity-0 group-hover:opacity-100 transition text-[8px]">
                                                        Lampiran Foto
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const getStatusStyles = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('ditolak')) {
        return { dot: 'bg-red-500', text: 'text-red-700', label: 'Ditolak' };
    }
    if (s.includes('selesai')) {
        return { dot: 'bg-green-500', text: 'text-green-700', label: 'Selesai' };
    }
    if (s.includes('diproses')) {
        return { dot: 'bg-orange-500', text: 'text-orange-700', label: 'Diproses' };
    }
    if (s.includes('diverifikasi') || s.includes('menunggu')) {
        return { dot: 'bg-blue-500', text: 'text-blue-700', label: s.includes('diverifikasi') ? 'Diverifikasi' : 'Menunggu' };
    }
    return { dot: 'bg-gray-400', text: 'text-gray-700', label: 'Komentar' };
};