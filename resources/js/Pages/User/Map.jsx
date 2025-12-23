import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Perbaikan icon default Leaflet yang sering hilang di React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapPage({ auth, reports }) {
    // Koordinat pusat Kecamatan Madukara, Banjarnegara
    const centerMadukara = [-7.3891, 109.7185];

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-xl text-blue-900 leading-tight">Peta Kerusakan Jalan Madukara</h2>}
        >
            <Head title="Peta Laporan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200">
                        {/* Container Peta */}
                        <div style={{ height: '70vh', width: '100%' }}>
                            <MapContainer 
                                center={centerMadukara} 
                                zoom={13} 
                                scrollWheelZoom={true}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {reports.map((report) => (
                                    <Marker 
                                        key={report.id} 
                                        position={[report.latitude, report.longitude]}
                                    >
                                        <Popup>
                                            <div className="w-48">
                                                <img 
                                                    src={`/storage/${report.foto_jalan}`} 
                                                    className="rounded-lg mb-2 w-full h-24 object-cover" 
                                                    alt="Foto Jalan"
                                                />
                                                <h3 className="font-bold text-blue-900 text-sm">{report.judul_laporan}</h3>
                                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{report.lokasi_detail}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                                        {report.status}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {report.total_upvote} Upvotes
                                                    </span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                    
                    {/* Legenda Sederhana */}
                    <div className="mt-4 flex gap-4 text-xs bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div> Laporan Warga</div>
                        <p className="text-gray-500 italic">*Klik marker untuk melihat detail laporan</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}