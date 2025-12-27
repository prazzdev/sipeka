import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { CheckCircle, Clock, AlertCircle, HardHat, Eye, ExternalLink, Printer, Edit2, Search } from 'lucide-react';
import Modal from '@/Components/Modal';
import { getStatusStyle } from '@/Helpers/getStatusStyle';
import { StatCard } from '@/Components/Fragments/StatCard';

export default function Dashboard({ auth, reports, stats, filters}) {
    const { data, setData, post, processing, reset, errors, patch } = useForm({
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

    // Opsi Tahun (3 tahun kebelakang)
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
        router.get(route('admin.dashboard'), 
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
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-xl text-blue-900 leading-tight">Admin Dashboard SIPEKA</h2>}
        >
            <Head title="Admin Dashboard" />

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submitStatus} className="p-6">
                    <h2 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
                        <span className="p-2 bg-yellow-400 rounded-lg">⚙️</span>
                        Update Progres Laporan
                    </h2>

                    <div className="space-y-5">
                        {/* Pilih Status */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Status Saat Ini</label>
                            <select 
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="w-full border-gray-200 rounded-xl focus:ring-blue-900 focus:border-blue-900 transition"
                            >
                                <option value="menunggu">Menunggu Verifikasi</option>
                                <option value="diverifikasi">Diverifikasi</option>
                                <option value="diproses">Dalam Perbaikan (Proses)</option>
                                <option value="selesai">Selesai Dikerjakan</option>
                                <option value="ditolak">Ditolak / Salah Alamat</option>
                            </select>
                        </div>

                        {/* Pesan/Tanggapan */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                                {data.status === 'Ditolak' ? 'Alasan Penolakan' : 'Pesan/Catatan Progres'}
                            </label>
                            <textarea 
                                value={data.pesan}
                                onChange={e => setData('pesan', e.target.value)}
                                placeholder="Berikan penjelasan detil untuk warga..."
                                className="w-full border-gray-200 rounded-xl focus:ring-blue-900 min-h-[120px]"
                            />
                            {errors.pesan && <p className="text-red-500 text-xs mt-1">{errors.pesan}</p>}
                        </div>

                        {/* Upload Foto (Custom Drag & Drop Style) */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Lampiran Foto Progres (Opsional)</label>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition">
                                <input 
                                    type="file" 
                                    onChange={e => setData('foto_tanggapan', e.target.files[0])}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 font-medium">
                                        {data.foto_tanggapan ? data.foto_tanggapan.name : 'Klik atau seret foto ke sini'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={closeModal} 
                            className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2.5 bg-blue-900 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-800 transition active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Update & Kirim Tanggapan'}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Statistik Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <StatCard title="Total Laporan" value={stats.total} icon={<AlertCircle className="text-blue-600"/>} color="bg-blue-50" />
                        <StatCard title="Menunggu" value={stats.pending} icon={<Clock className="text-yellow-600"/>} color="bg-yellow-50" />
                        <StatCard title="Diproses" value={stats.proses} icon={<HardHat className="text-orange-600"/>} color="bg-orange-50" />
                        <StatCard title="Selesai" value={stats.selesai} icon={<CheckCircle className="text-green-600"/>} color="bg-green-50" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between group hover:border-blue-400 transition">
                            <div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Laporan Hari Ini</p>
                                <p className="text-3xl font-black text-blue-900">{stats.hari_ini}</p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition">
                                <Clock size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm flex items-center justify-between group hover:border-green-400 transition">
                            <div>
                                <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em]">Laporan Bulan Ini</p>
                                <p className="text-3xl font-black text-blue-900">{stats.bulan_ini}</p>
                            </div>
                            <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Filter & Sort Bar */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-wrap items-center justify-between gap-4">
                        
                        {/* Kolom Search (Kiri) */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Cari laporan..."
                                defaultValue={filters.search}
                                onBlur={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-10 w-full rounded-lg border-gray-300 text-sm focus:ring-blue-900"
                            />
                        </div>

                        {/* Dropdown Filters (Tengah) */}
                        <div className="flex flex-wrap items-center gap-2">
                            <select 
                                value={filters.month || 'all'} 
                                onChange={(e) => handleFilterChange('month', e.target.value)}
                                className="rounded-lg border-gray-300 text-sm font-bold text-gray-600 focus:ring-blue-900"
                            >
                                {months.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                            </select>

                            <select 
                                value={filters.year || currentYear} 
                                onChange={(e) => handleFilterChange('year', e.target.value)}
                                className="rounded-lg border-gray-300 text-sm font-bold text-gray-600 focus:ring-blue-900"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>

                            <select 
                                value={filters.status || ''} 
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="rounded-lg border-gray-300 text-sm font-bold text-blue-900 focus:ring-blue-900"
                            >
                                <option value="">Semua Status</option>
                                <option value="menunggu">Menunggu</option>
                                <option value="diverifikasi">Diverifikasi</option>
                                <option value="diproses">Diproses</option>
                                <option value="selesai">Selesai</option>
                                <option value="ditolak">Ditolak</option>
                            </select>
                        </div>

                        {/* Export & Sort (Kanan) */}
                        <div className="flex items-center gap-2">
                            <select 
                                value={filters.sort || 'latest'} 
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="rounded-lg border-gray-300 text-sm font-bold focus:ring-blue-900"
                            >
                                <option value="latest">Terbaru</option>
                                <option value="upvote">Populer</option>
                            </select>
                            <a 
                                href={route('admin.export', filters)} 
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center"
                            >
                                <Printer size={16} className="mr-2" /> Export
                            </a>
                        </div>
                    </div>

                    {/* Tabel Laporan */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200">
                        <div className="p-6 text-gray-900 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-blue-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">###</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">No Lap</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Pelapor</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Judul & Lokasi</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Status</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.data.length > 0 ? (
                                        reports.data.map((report, index) => (
                                            <tr key={report.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {/* Rumus: (Halaman_Sekarang - 1) * Per_Halaman + Index + 1 */}
                                                    {(reports?.current_page - 1) * reports?.per_page + index + 1}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {reports?.data[index]?.nomor_laporan}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900">{report.user.name}</div>
                                                    <div className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString('id-ID')}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-blue-900 flex items-center">
                                                        {report.judul_laporan}
                                                        {report.total_upvote > 50 && (
                                                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded animate-pulse">
                                                                PRIORITAS
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-900 flex items-center group">
                                                        {report.lokasi_detail}
                                                        <a 
                                                            href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                                            target="_blank"
                                                            className="ml-2 opacity-100 transition text-blue-500"
                                                            title="Buka di Google Maps"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${getStatusStyle(report.status)}`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Link 
                                                            href={route('laporan.show', report.id)} 
                                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                                            title="Lihat Detail (Publik)"
                                                        >
                                                            <Eye size={18} />
                                                        </Link>

                                                        <Link 
                                                            href={route('admin.report.manage', report.id)} 
                                                            className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                                                            title="Kelola Histori & Komentar"
                                                        >
                                                            <Edit2 size={18} />
                                                        </Link>
                                                        
                                                        <button
                                                            onClick={() => openModal(report)}
                                                            className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition text-sm"
                                                        >
                                                            Tanggapi
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    {/* Icon untuk mempercantik tampilan */}
                                                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                                                        <Search size={40} className="text-gray-300" />
                                                    </div>
                                                    <h3 className="text-gray-900 font-bold text-lg">
                                                        {filters.search ? 'Laporan tidak ditemukan' : 'Belum ada laporan'}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm max-w-xs mx-auto mt-1">
                                                        {filters.search 
                                                            ? `Tidak ada hasil untuk kata kunci "${filters.search}". Coba gunakan kata kunci lain.` 
                                                            : 'Saat ini belum ada data laporan yang masuk ke dalam sistem.'}
                                                    </p>
                                                    {filters.search && (
                                                        <button 
                                                            onClick={() => handleFilterChange('search', '')}
                                                            className="mt-4 text-blue-900 font-bold text-xs uppercase tracking-widest hover:underline"
                                                        >
                                                            Bersihkan Pencarian
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="mt-6 flex flex-wrap justify-center items-center gap-1">
                                {reports.links && reports.links.map((link, k) => (
                                    link.url === null ? (
                                        <span
                                            key={k}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="px-4 py-2 text-sm rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed"
                                        />
                                    ) : (
                                        <Link
                                            key={k}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                                link.active 
                                                    ? 'bg-blue-900 text-white border-blue-900 font-bold shadow-sm' 
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-900 hover:text-blue-900'
                                            }`}
                                            preserveScroll
                                        />
                                    )
                                ))}
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-4">
                                Menampilkan {reports.from} sampai {reports.to} dari total {reports.total} laporan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}