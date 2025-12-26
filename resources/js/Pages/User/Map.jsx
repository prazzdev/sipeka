import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createCustomIcon = (status) => {
    let colorClass = 'bg-blue-500';

    if (status?.toLowerCase() === 'selesai') colorClass = 'bg-green-500';
    if (status?.toLowerCase() === 'diproses') colorClass = 'bg-orange-500';
    if (status?.toLowerCase() === 'ditolak') colorClass = 'bg-red-500';
    if (status?.toLowerCase() === 'diverifikasi') colorClass = 'bg-blue-600';

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-6 h-6 ${colorClass} rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

export default function MapPage({ auth, reports }) {
    const centerMadukara = [-7.3891, 109.7185];

    // Logika Jam Real-time
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Formatter Tanggal Indonesia
    const formattedDate = currentTime.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = currentTime.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-xl text-blue-900 leading-tight">Peta Kerusakan Jalan Madukara</h2>}
        >
            <Head title="Peta Laporan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 px-2 gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Live Monitoring</h3>
                            <p className="text-[10px] text-gray-500 italic">Data sebaran kerusakan jalan di wilayah Kec. Madukara</p>
                        </div>
                        <div className="bg-blue-900 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-200 flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-medium text-blue-200">{formattedDate}</span>
                                <span className="text-sm font-black tracking-widest">{formattedTime} WIB</span>
                            </div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200">
                        <div style={{ height: '70vh', width: '100%' }}>
                            <MapContainer 
                                center={centerMadukara} 
                                zoom={13} 
                                scrollWheelZoom={true}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {reports.map((report) => (
                                    <Marker 
                                        key={report.id} 
                                        position={[report.latitude, report.longitude]}
                                        icon={createCustomIcon(report.status)}
                                    >
                                        <Popup>
                                            <div className="w-48 p-1">
                                                <img 
                                                    src={report.foto_jalan ? `/storage/${report.foto_jalan}` : '/storage/no-image.png'} 
                                                    className="rounded-lg mb-2 w-full h-24 object-cover" 
                                                    alt="Foto"
                                                />
                                                <h3 className="font-bold text-blue-900 text-sm">{report.judul_laporan}</h3>
                                                <p className="text-[10px] text-gray-500 mb-2">{report.lokasi_detail}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded text-white ${
                                                        report.status === 'selesai' ? 'bg-green-500' :
                                                        report.status === 'diproses' ? 'bg-orange-500' :
                                                        report.status === 'ditolak' ? 'bg-red-500' : 'bg-blue-500'
                                                    }`}>
                                                        {report.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                    
                    {/* Legenda Dinamis */}
                    <div className="mt-4 grid grid-cols-2 md:flex md:flex-wrap gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <LegendItem color="bg-blue-500" label="Menunggu / Verifikasi" />
                        <LegendItem color="bg-orange-500" label="Dalam Perbaikan (Proses)" />
                        <LegendItem color="bg-green-500" label="Selesai Dikerjakan" />
                        <LegendItem color="bg-red-500" label="Laporan Ditolak" />
                    </div>
                    <p className="mt-2 text-center text-[10px] text-gray-400 italic">*Klik marker pada peta untuk melihat detail setiap laporan warga</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Komponen Kecil untuk Item Legenda
function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-4 h-4 ${color} rounded-full border-2 border-white shadow-sm`}></div>
            <span className="text-xs font-bold text-gray-600">{label}</span>
        </div>
    );
}