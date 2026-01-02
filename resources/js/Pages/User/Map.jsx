import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
// Import LayersControl untuk fitur switch map
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { Maximize2, X, MapPin, ChevronRight, Eye } from 'lucide-react';
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

export default function MapPage({ auth, reports, filters }) {
    const centerMadukara = [-7.3891, 109.7185];
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);

    const [filterData, setFilterData] = useState({
        month: filters.month,
        year: filters.year
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...filterData, [name]: value };
        setFilterData(newData);
        
        router.get(route('peta.index'), newData, {
            preserveState: true,
            replace: true
        });
    };

    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const months = [
        { v: 'all', l: 'Semua Bulan' },
        { v: '01', l: 'Januari' }, { v: '02', l: 'Februari' }, { v: '03', l: 'Maret' },
        { v: '04', l: 'April' }, { v: '05', l: 'Mei' }, { v: '06', l: 'Juni' },
        { v: '07', l: 'Juli' }, { v: '08', l: 'Agustus' }, { v: '09', l: 'September' },
        { v: '10', l: 'Oktober' }, { v: '11', l: 'November' }, { v: '12', l: 'Desember' }
    ];
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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

            <div className="py-6 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header: Filter & Jam */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-4 px-2 gap-4">
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-blue-900 ml-1 uppercase">Bulan</label>
                                <select 
                                    name="month" 
                                    value={filterData.month} 
                                    onChange={handleFilterChange}
                                    className="border-gray-300 rounded-lg text-xs focus:ring-blue-500 font-bold text-blue-900"
                                >
                                    {months.map(m => (
                                        <option key={m.v} value={m.v}>{m.l}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-blue-900 ml-1 uppercase">Tahun</label>
                                <select 
                                    name="year" 
                                    value={filterData.year} 
                                    onChange={handleFilterChange}
                                    className="border-gray-300 rounded-lg text-xs focus:ring-blue-500 font-bold text-blue-900"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-blue-900 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-200 flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-medium text-blue-200">{formattedDate}</span>
                                <span className="text-sm font-black tracking-widest">{formattedTime} WIB</span>
                            </div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                    </div>

                    {/* Map Container Wrapper */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200 relative group">
                        <div style={{ height: '70vh', width: '100%' }}>
                            <MapContainer 
                                center={centerMadukara} 
                                zoom={13} 
                                scrollWheelZoom={true}
                                style={{ height: '100%', width: '100%' }}
                            >
                                {/* Penambahan LayersControl untuk Switch Map */}
                                <LayersControl position="topright">
                                    <LayersControl.BaseLayer checked name="Peta Grafik">
                                        <TileLayer
                                            attribution='&copy; OpenStreetMap'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                    </LayersControl.BaseLayer>
                                    <LayersControl.BaseLayer name="Satelit">
                                        <TileLayer
                                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
                                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                        />
                                    </LayersControl.BaseLayer>
                                </LayersControl>

                                {reports.map((report) => (
                                    <Marker 
                                        key={report.id} 
                                        position={[report.latitude, report.longitude]}
                                        icon={createCustomIcon(report.status)}
                                    >
                                        <Popup>
                                            <div className="w-48 p-1 font-sans">
                                                <div className="mb-2">
                                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm text-white uppercase tracking-wider ${
                                                        report.status === 'selesai' ? 'bg-green-500' :
                                                        report.status === 'diproses' ? 'bg-orange-500' :
                                                        report.status === 'ditolak' ? 'bg-red-500' : 'bg-blue-500'
                                                    }`}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                <img 
                                                    src={report.foto_jalan ? `/storage/${report.foto_jalan}` : '/storage/no-image.png'} 
                                                    className="rounded-lg mb-2 w-full h-24 object-cover shadow-sm" 
                                                    alt="Foto"
                                                />
                                                <h3 className="font-bold text-blue-900 text-sm leading-tight mb-1">{report.judul_laporan}</h3>
                                                <p className="text-[10px] text-gray-500 mb-3 leading-tight">{report.lokasi_detail}</p>
                                                <Link 
                                                    href={route('laporan.show', report.id)}
                                                    className="flex items-center justify-center bg-blue-900 !text-white py-1.5 rounded-md text-[10px] font-bold hover:bg-blue-800 transition shadow-sm uppercase w-full no-underline"
                                                >
                                                    Lihat Detail <ChevronRight size={12} className="ml-1 !text-white" />
                                                </Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        <button 
                            type="button"
                            onClick={() => setIsMapFullscreen(true)}
                            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-gray-200 text-blue-900 hover:bg-white active:scale-90 transition-all z-[400]"
                        >
                            <Maximize2 size={18} />
                        </button>
                    </div>

                    {/* MODAL FULLSCREEN MAP */}
                    {isMapFullscreen && (
                        <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
                            <div className="p-4 flex items-center justify-between bg-blue-900 text-white shadow-lg">
                                <div className="flex items-center gap-2 font-bold uppercase text-sm tracking-wider">
                                    <MapPin size={20} />
                                    <span>Monitoring Peta Laporan</span>
                                </div>
                                <button 
                                    onClick={() => setIsMapFullscreen(false)}
                                    className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 w-full">
                                <MapContainer 
                                    center={centerMadukara} 
                                    zoom={14} 
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    {/* LayersControl juga diterapkan di Fullscreen */}
                                    <LayersControl position="topright">
                                        <LayersControl.BaseLayer checked name="Peta Grafik">
                                            <TileLayer
                                                attribution='&copy; OpenStreetMap'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                        </LayersControl.BaseLayer>
                                        <LayersControl.BaseLayer name="Satelit">
                                            <TileLayer
                                                attribution='Tiles &copy; Esri &mdash; Source: Esri'
                                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                            />
                                        </LayersControl.BaseLayer>
                                    </LayersControl>

                                    {reports.map((report) => (
                                        <Marker key={`fs-${report.id}`} position={[report.latitude, report.longitude]} icon={createCustomIcon(report.status)}>
                                            <Popup>
                                                <div className="w-48 p-1 font-sans">
                                                    <div className="mb-2">
                                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm text-white uppercase tracking-wider ${
                                                            report.status === 'selesai' ? 'bg-green-500' :
                                                            report.status === 'diproses' ? 'bg-orange-500' :
                                                            report.status === 'ditolak' ? 'bg-red-500' : 'bg-blue-500'
                                                        }`}>
                                                            {report.status}
                                                        </span>
                                                    </div>
                                                    <img 
                                                        src={report.foto_jalan ? `/storage/${report.foto_jalan}` : '/storage/no-image.png'} 
                                                        className="rounded-lg mb-2 w-full h-24 object-cover shadow-sm" 
                                                        alt="Foto"
                                                    />
                                                    <h3 className="font-bold text-blue-900 text-sm leading-tight mb-1">{report.judul_laporan}</h3>
                                                    <p className="text-[10px] text-gray-500 mb-3 leading-tight">{report.lokasi_detail}</p>
                                                    <Link 
                                                        href={route('laporan.show', report.id)}
                                                        className="flex items-center justify-center bg-blue-900 !text-white py-1.5 rounded-md text-[10px] font-bold hover:bg-blue-800 transition shadow-sm uppercase w-full no-underline"
                                                    >
                                                        Lihat Detail <ChevronRight size={12} className="ml-1 !text-white" />
                                                    </Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        </div>
                    )}
                    
                    {/* Legenda Dinamis */}
                    <div className="mt-4 grid grid-cols-2 md:flex md:flex-wrap gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <LegendItem color="bg-blue-500" label="Menunggu / Verifikasi" />
                        <LegendItem color="bg-orange-500" label="Dalam Perbaikan (Proses)" />
                        <LegendItem color="bg-green-500" label="Selesai Dikerjakan" />
                        <LegendItem color="bg-red-500" label="Laporan Ditolak" />
                    </div>
                    <p className="mt-2 text-center text-[10px] text-gray-400 italic font-sans">*Klik marker pada peta untuk melihat detail setiap laporan warga</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-4 h-4 ${color} rounded-full border-2 border-white shadow-sm`}></div>
            <span className="text-xs font-bold text-gray-600 font-sans">{label}</span>
        </div>
    );
}