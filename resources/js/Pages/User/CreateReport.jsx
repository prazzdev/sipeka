import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Camera, MapPin, Loader2 } from 'lucide-react';

export default function CreateReport({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        judul_laporan: '',
        deskripsi: '',
        foto_jalan: null,
        lokasi_detail: '',
        latitude: '',
        longitude: '',
    });

    const [gettingLocation, setGettingLocation] = useState(false);

    // Fungsi ambil koordinat GPS
    const getLocation = () => {
        setGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setData(prevData => ({
                    ...prevData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setGettingLocation(false);
                alert("Lokasi berhasil dikunci!");
            });
        } else {
            alert("Geolocation tidak didukung oleh browser ini.");
            setGettingLocation(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('laporan.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl text-blue-900">Buat Laporan Baru</h2>}>
            <Head title="Buat Laporan" />

            <div className="py-12 px-4">
                <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Judul */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Judul Laporan</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                placeholder="Contoh: Lubang Besar di Jl. Madukara"
                                onChange={e => setData('judul_laporan', e.target.value)}
                            />
                            {errors.judul_laporan && <div className="text-red-500 text-xs mt-1">{errors.judul_laporan}</div>}
                        </div>

                        {/* Foto */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Foto Kerusakan</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-yellow-500 transition">
                                <div className="space-y-1 text-center">
                                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <input 
                                            type="file" 
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                                            onChange={e => setData('foto_jalan', e.target.files[0])}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lokasi Manual */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Lokasi Detail (Alamat/Patokan)</label>
                            <textarea 
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                rows="2"
                                onChange={e => setData('lokasi_detail', e.target.value)}
                            ></textarea>
                        </div>

                        {/* GPS Button */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <button 
                                type="button"
                                onClick={getLocation}
                                className="flex items-center justify-center w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
                            >
                                {gettingLocation ? <Loader2 className="animate-spin mr-2" /> : <MapPin className="mr-2" />}
                                {data.latitude ? "Lokasi Terkunci ✅" : "Ambil Lokasi GPS"}
                            </button>
                            <div className="flex justify-between mt-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                <span>Lat: {data.latitude || '-'}</span>
                                <span>Long: {data.longitude || '-'}</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-yellow-400 text-blue-900 font-bold py-4 rounded-xl shadow-lg hover:bg-yellow-500 transition transform active:scale-95 uppercase"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Laporan'}
                        </button>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}