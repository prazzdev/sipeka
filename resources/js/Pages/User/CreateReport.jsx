import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Camera, MapPin, Loader2, Map as MapIcon, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

export default function CreateReport({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        judul_laporan: '',
        deskripsi: '',
        foto_jalan: null,
        lokasi_detail: '',
        latitude: '',
        longitude: '',
    });
    
    const [gettingLocation, setGettingLocation] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const centerMadukara = [-7.3891, 109.7185];

    // Komponen internal untuk menangani klik pada peta
    function LocationPicker() {
        useMapEvents({
            click(e) {
                setData(prev => ({
                    ...prev,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }));
            },
        });

        return data.latitude && data.longitude ? (
            <Marker position={[data.latitude, data.longitude]} icon={DefaultIcon} />
        ) : null;
    }

    const getLocation = () => {
        setGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setGettingLocation(false);
            }, (error) => {
                alert("Gagal mengambil lokasi: " + error.message);
                setGettingLocation(false);
            });
        } else {
            alert("Geolocation tidak didukung browser.");
            setGettingLocation(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('laporan.store'), {
            forceFormData: true,
            onSuccess: () => {
                // Munculkan Alert Sukses
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Laporan Anda telah terkirim dan akan segera diverifikasi oleh admin.',
                    icon: 'success',
                    confirmButtonText: 'Oke, Mengerti',
                    confirmButtonColor: '#1e3a8a',
                });

                reset();
            },
            onError: () => {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Pastikan semua form telah terisi dengan benar.',
                    icon: 'error',
                    confirmButtonText: 'Coba Lagi',
                });
                // Swal.fire({
                //     title: 'Gagal!',
                //     text: err.message || 'Pastikan semua data dan koordinat lokasi sudah terisi.',
                //     icon: 'error',
                //     confirmButtonText: 'Cek Kembali',
                // });
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl text-blue-900">Buat Laporan Baru</h2>}>
            <Head title="Buat Laporan" />

            <div className="py-12 px-4">
                <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Judul Laporan */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Judul Laporan</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                placeholder="Contoh: Lubang Besar di Jl. Madukara"
                                value={data.judul_laporan}
                                onChange={e => setData('judul_laporan', e.target.value)}
                            />
                            {errors.judul_laporan && <div className="text-red-500 text-xs mt-1">{errors.judul_laporan}</div>}
                        </div>

                        {/* Upload Foto */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Foto Kerusakan</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-yellow-500 transition relative overflow-hidden">
                                {data.foto_jalan ? (
                                    <div className="text-center">
                                        <p className="text-sm text-green-600 font-bold mb-2">Foto Terpilih: {data.foto_jalan.name}</p>
                                        <button type="button" onClick={() => setData('foto_jalan', null)} className="text-xs text-red-500 underline">Ganti Foto</button>
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-center">
                                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={e => setData('foto_jalan', e.target.files[0])}
                                            />
                                            <span className="text-blue-600 font-bold">Pilih foto</span>
                                            <p className="pl-1">atau ambil gambar</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lokasi Detail */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Lokasi Detail (Alamat/Patokan)</label>
                            <textarea 
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                rows="2"
                                placeholder="Sebutkan nama jalan atau ciri bangunan terdekat..."
                                value={data.lokasi_detail}
                                onChange={e => setData('lokasi_detail', e.target.value)}
                            ></textarea>
                        </div>

                        {/* Deskripsi Lengkap */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 flex justify-between">
                                <span>Deskripsi Laporan</span>
                                <span className="text-[10px] text-gray-400 font-normal italic">Opsional</span>
                            </label>
                            <textarea 
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                                rows="4"
                                placeholder="Ceritakan detail kerusakan, dampak bagi warga, atau sudah berapa lama kerusakan terjadi..."
                                value={data.deskripsi}
                                onChange={e => setData('deskripsi', e.target.value)}
                            ></textarea>
                            {errors.deskripsi && <div className="text-red-500 text-xs mt-1">{errors.deskripsi}</div>}
                            <p className="mt-1 text-[10px] text-gray-400">
                                Informasi tambahan membantu admin memprioritaskan perbaikan.
                            </p>
                        </div>

                        {/* Bagian GPS & Map Picker */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-700 text-center">Tentukan Lokasi GPS</label>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    type="button"
                                    onClick={getLocation}
                                    className="flex items-center justify-center bg-blue-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-blue-800 transition"
                                >
                                    {gettingLocation ? <Loader2 className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
                                    GPS SAAT INI
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => setShowMap(!showMap)}
                                    className={`flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition border-2 ${showMap ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-blue-900 text-blue-900'}`}
                                >
                                    {showMap ? <X className="mr-2" size={16} /> : <MapIcon className="mr-2" size={16} />}
                                    {showMap ? "TUTUP PETA" : "PILIH DI PETA"}
                                </button>
                            </div>

                            {/* Map Picker Area */}
                            {showMap && (
                                <div className="h-64 w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner mt-2">
                                    <MapContainer center={centerMadukara} zoom={13} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationPicker />
                                    </MapContainer>
                                    <p className="text-[9px] bg-yellow-50 text-yellow-700 text-center py-1 font-bold">KLIK PADA PETA UNTUK MENENTUKAN TITIK</p>
                                </div>
                            )}

                            {/* Info Koordinat */}
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-[10px] text-gray-500 font-mono tracking-tighter">
                                <span>LAT: {data.latitude || 'BELUM DISET'}</span>
                                <span>LONG: {data.longitude || 'BELUM DISET'}</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-yellow-400 text-blue-900 font-black py-4 rounded-xl shadow-lg shadow-yellow-100 hover:bg-yellow-500 transition transform active:scale-95 uppercase tracking-widest"
                        >
                            {processing ? 'Sedang Mengirim...' : 'Kirim Laporan Warga'}
                        </button>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}