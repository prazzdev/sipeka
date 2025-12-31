import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
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
                {/* Aksen Warna di bagian atas card (Opsional, untuk mempermanis) */}
                <div className="h-2 bg-gradient-to-r from-blue-900 via-blue-800 to-yellow-400"></div>
                
                {/* Area Konten (Children) dengan Padding yang pas */}
                <div className="px-8 py-10">
                    {children}
                </div>
            </div>

            {/* Footer Footer Kecil di bawah card */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
                    &copy; 2025 SIPEKA Madukara - Banjarnegara
                </p>
            </div>
        </div>
    );
}