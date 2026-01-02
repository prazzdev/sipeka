import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, AlertCircle, HardHat, ListChecks, TrendingUp, ArrowRight, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { StatCard } from '@/Components/Fragments/StatCard';
// Import Recharts components
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard({ auth, stats }) {
    const getPercent = (val) => stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

    // Data untuk Bar Chart (Statistik per Status)
    const barData = [
        { name: 'Menunggu', total: stats.pending, fill: '#fbbf24' },
        { name: 'Proses', total: stats.proses, fill: '#f97316' },
        { name: 'Selesai', total: stats.selesai, fill: '#22c55e' },
        { name: 'Ditolak', total: stats.total - (stats.selesai + stats.proses + stats.pending), fill: '#ef4444' },
    ];

    // Data untuk Pie Chart
    const pieData = [
        { name: 'Selesai', value: stats.selesai },
        { name: 'Belum Selesai', value: stats.total - stats.selesai },
    ];
    const COLORS = ['#22c55e', '#e5e7eb'];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-xl text-blue-900 leading-tight">Dashboard Statistik SIPEKA</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* BARIS 1: Ringkasan Periodik (Pindah ke Atas) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-between text-white transition hover:scale-[1.02]">
                            <div>
                                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Laporan Hari Ini</p>
                                <p className="text-4xl font-black">{stats.hari_ini}</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl"><Clock size={32} /></div>
                        </div>
                        <div className="bg-gradient-to-r from-green-600 to-green-800 p-5 rounded-2xl shadow-lg shadow-green-100 flex items-center justify-between text-white transition hover:scale-[1.02]">
                            <div>
                                <p className="text-[10px] font-black text-green-100 uppercase tracking-widest">Laporan Bulan Ini</p>
                                <p className="text-4xl font-black">{stats.bulan_ini}</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl"><CheckCircle size={32} /></div>
                        </div>
                    </div>

                    {/* BARIS 2: Statistik Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <StatCard title="Total Laporan" value={stats.total} icon={<AlertCircle className="text-blue-600"/>} color="bg-blue-50" />
                        <StatCard title="Menunggu" value={stats.pending} icon={<Clock className="text-yellow-600"/>} color="bg-yellow-50" />
                        <StatCard title="Diproses" value={stats.proses} icon={<HardHat className="text-orange-600"/>} color="bg-orange-50" />
                        <StatCard title="Selesai" value={stats.selesai} icon={<CheckCircle className="text-green-600"/>} color="bg-green-50" />
                    </div>

                    {/* BARIS 3: Visualisasi Grafik */}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Bar Chart: Distribusi Status */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <BarChart3 size={20} className="text-blue-900" />
                                Perbandingan Status Laporan
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                        <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart: Completion Rate */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <PieChartIcon size={20} className="text-blue-900" />
                                Persentase Tuntas
                            </h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-3xl font-black text-green-600">{getPercent(stats.selesai)}%</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Laporan Berhasil Diselesaikan</p>
                            </div>
                        </div>
                    </div>

                    {/* BARIS 4: Progres Manual & Shortcut */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-8">
                                <TrendingUp size={20} className="text-blue-900" />
                                Detail Progres Penanganan
                            </h3>
                            <div className="space-y-6">
                                <ProgressBar label="Selesai Tuntas" count={stats.selesai} percent={getPercent(stats.selesai)} color="bg-green-500" />
                                <ProgressBar label="Sedang Diperbaiki" count={stats.proses} percent={getPercent(stats.proses)} color="bg-orange-500" />
                                <ProgressBar label="Antrean Verifikasi" count={stats.pending} percent={getPercent(stats.pending)} color="bg-yellow-400" />
                                <ProgressBar label="Ditolak/Arsip" count={stats.total - (stats.selesai + stats.proses + stats.pending)} percent={getPercent(stats.total - (stats.selesai + stats.proses + stats.pending))} color="bg-red-400" />
                            </div>
                        </div>

                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl flex flex-col justify-between">
                            <div>
                                <ListChecks size={40} className="text-blue-300 mb-4" />
                                <h3 className="text-lg font-bold mb-2 tracking-tight">Kelola Laporan</h3>
                                <p className="text-sm text-blue-200 leading-relaxed mb-6">
                                    Lakukan verifikasi, update progres perbaikan, dan beri tanggapan resmi kepada warga Madukara.
                                </p>
                            </div>
                            <Link 
                                href={route('admin.laporan.index')} 
                                className="flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition active:scale-95"
                            >
                                Buka Manajemen <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function ProgressBar({ label, count, percent, color }) {
    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">{label} ({count})</span>
                <span className={`text-sm font-black ${color.replace('bg-', 'text-')}`}>{percent}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`${color} h-full transition-all duration-1000`} 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
}