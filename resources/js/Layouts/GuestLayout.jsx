import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function GuestLayout({ children }) {
    const { server_time } = usePage().props;
    const [loadTime, setLoadTime] = useState(0);

    useEffect(() => {
        // Menghitung selisih waktu
        const now = new Date().getTime();
        const diff = Math.abs((now - server_time) / 1000);
        setLoadTime(diff.toFixed(3));
    }, [server_time]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:px-0">
            {/* Logo Section dengan Animasi Halus */}
            <div className="mb-6 transform transition-transform hover:scale-105 duration-300">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-auto text-blue-900 fill-current" />
                </Link>
            </div>

            {/* Kontainer Card Form */}
            <div className="w-full sm:max-w-md bg-white shadow-2xl shadow-blue-100 rounded-3xl overflow-hidden border border-gray-100">
                {/* Aksen Warna di bagian atas card */}
                <div className="h-2 bg-gradient-to-r from-blue-900 via-blue-800 to-yellow-400"></div>
                
                {/* Area Konten (Children) */}
                <div className="px-8 py-10">
                    {children}
                </div>
            </div>

            {/* Footer di bawah card */}
            <div className="mt-8 text-center space-y-2">
                <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
                    &copy; 2025 SIPEKA Madukara - Banjarnegara
                </p>
                
                {/* Info Load Time (Response Time) */}
                <div className="flex items-center justify-center gap-2 text-[9px] text-gray-300 font-mono uppercase tracking-tighter">
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span>Response Time: {loadTime}s</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                </div>
            </div>
        </div>
    );
}