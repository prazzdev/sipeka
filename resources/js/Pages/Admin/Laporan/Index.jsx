import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { CheckCircle, Clock, AlertCircle, HardHat, Eye, ExternalLink, Printer, Edit2, Search, Trash2, ChevronRight } from 'lucide-react';
import Modal from '@/Components/Modal';
import { getStatusStyle } from '@/Helpers/getStatusStyle';
import Swal from 'sweetalert2';

export default function Index({ auth, reports, filters }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        status: '',
        pesan: '',
        foto_tanggapan: null,
    }); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const openModal = (report) => {
        setSelectedReport(report);
        setData({
            status: report.status,
            pesan: '', 
            foto_tanggapan: null,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
        reset(); 
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

    const months = [
        { v: 'all', l: 'Semua Bulan' },
        { v: '01', l: 'Januari' }, { v: '02', l: 'Februari' }, { v: '03', l: 'Maret' },
        { v: '04', l: 'April' }, { v: '05', l: 'Mei' }, { v: '06', l: 'Juni' },
        { v: '07', l: 'Juli' }, { v: '08', l: 'Agustus' }, { v: '09', l: 'September' },
        { v: '10', l: 'Oktober' }, { v: '11', l: 'November' }, { v: '12', l: 'Desember' }
    ];

    const handleFilterChange = (key, value) => {
        router.get(route('admin.laporan.index'), 
            { ...filters, [key]: value }, 
            { preserveState: true, replace: true }
        );
    };

    const submitStatus = (e) => {
        e.preventDefault();
        post(route('admin.status.update', selectedReport.id), {
            forceFormData: true,
            onSuccess: () => {
                closeModal();
                Swal.fire({
                    title: 'Tanggapan Terkirim!',
                    text: 'Status laporan berhasil diperbarui.',
                    icon: 'success',
                    confirmButtonColor: '#1e3a8a',
                });
            },
        });
    };

    const confirmDelete = (id) => {
        Swal.fire({
            title: 'Arsip Laporan?',
            text: "Laporan akan disembunyikan dari publik.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Arsipkan!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('laporan.destroy', id));
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-xl text-blue-900 leading-tight">Manajemen Laporan Warga</h2>}
        >
            <Head title="Kelola Laporan" />

            {/* Modal Tanggapi tetap sama */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submitStatus} className="p-6">
                    <h2 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
                        <span className="p-2 bg-yellow-400 rounded-lg">⚙️</span>
                        Update Progres Laporan
                    </h2> 
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Status Saat Ini</label>
                            <select 
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="w-full border-gray-200 rounded-xl focus:ring-blue-900 shadow-sm"
                            >
                                <option value="menunggu">Menunggu Verifikasi</option>
                                <option value="diverifikasi">Diverifikasi</option>
                                <option value="diproses">Dalam Perbaikan (Proses)</option>
                                <option value="selesai">Selesai Dikerjakan</option>
                                <option value="ditolak">Ditolak / Salah Alamat</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Pesan/Catatan Progres</label>
                            <textarea 
                                value={data.pesan}
                                onChange={e => setData('pesan', e.target.value)}
                                className="w-full border-gray-200 rounded-xl focus:ring-blue-900 min-h-[120px]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Lampiran Foto Progres</label>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:bg-gray-50">
                                <input 
                                    type="file" 
                                    onChange={e => setData('foto_tanggapan', e.target.files[0])}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <p className="text-center text-sm text-gray-600">
                                    {data.foto_tanggapan ? data.foto_tanggapan.name : 'Klik untuk upload foto progres'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-6 py-2.5 font-bold text-gray-500">Batal</button>
                        <button type="submit" disabled={processing} className="px-8 py-2.5 bg-blue-900 text-white rounded-xl font-black shadow-lg">Update Status</button>
                    </div>
                </form>
            </Modal>

            <div className="py-8">
                {/* Filter Bar (tetap sama) */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="relative w-full md:w-64">
                        <form onSubmit={(e) => { e.preventDefault(); handleFilterChange('search', e.target.search.value); }}>
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input 
                                name="search" type="text" placeholder="Cari laporan..." defaultValue={filters.search}
                                onBlur={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-10 w-full rounded-lg border-gray-200 text-sm focus:ring-blue-900"
                            />
                        </form>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <select value={filters.month || 'all'} onChange={(e) => handleFilterChange('month', e.target.value)} className="rounded-lg border-gray-300 text-sm font-bold text-gray-600">
                            {months.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                        </select>
                        <select value={filters.year || currentYear} onChange={(e) => handleFilterChange('year', e.target.value)} className="rounded-lg border-gray-300 text-sm font-bold text-gray-600">
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select value={filters.status || ''} onChange={(e) => handleFilterChange('status', e.target.value)} className="rounded-lg border-gray-300 text-sm font-bold text-blue-900">
                            <option value="">Semua Status</option>
                            <option value="menunggu">Menunggu</option>
                            <option value="diverifikasi">Diverifikasi</option>
                            <option value="diproses">Diproses</option>
                            <option value="selesai">Selesai</option>
                            <option value="ditolak">Ditolak</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={route('admin.export', filters)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm">
                            <Printer size={16} className="mr-2" /> Export
                        </a>
                    </div>
                </div>

                {/* Tabel */}
                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-widest">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-widest">No Laporan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-widest">Pelapor</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-widest">Judul & Lokasi</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-widest">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {reports.data.length > 0 ? (
                                    reports.data.map((report, index) => (
                                        <tr key={report.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm text-gray-500">{(reports.current_page - 1) * reports.per_page + index + 1}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-700">{report.nomor_laporan}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{report.user.name}</div>
                                                <div className="text-xs text-gray-400">{new Date(report.created_at).toLocaleDateString('id-ID')}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-blue-900">{report.judul_laporan}</div>
                                                <div className="text-sm text-gray-600 flex items-center">
                                                    <span className="truncate max-w-[150px]">{report.lokasi_detail}</span>
                                                    <a href={`http://maps.google.com/?q=${report.latitude},${report.longitude}`} target="_blank" className="ml-1 text-blue-500"><ExternalLink size={14} /></a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${getStatusStyle(report.status)}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button onClick={() => openModal(report)} className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition text-sm shadow-sm whitespace-nowrap">
                                                        Tanggapi
                                                    </button>
                                                    <Link href={route('laporan.show', report.id)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Eye size={18} /></Link>
                                                    <Link href={route('admin.report.manage', report.id)} className="p-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition"><Edit2 size={18} /></Link>
                                                    <button onClick={() => confirmDelete(report.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center text-gray-500 font-bold">Data tidak ditemukan</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION SECTION */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                            Menampilkan {reports.from} - {reports.to} dari {reports.total} Laporan
                        </div>
                        <div className="flex gap-2">
                            {reports.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                                        link.active 
                                        ? 'bg-blue-900 text-white shadow-md' 
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}