import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Home, Map, PlusCircle, User, LayoutDashboard, Info, ListChecks, LogOut, Menu, X } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
            {/* Desktop Navbar */}
            <nav className="hidden sm:block border-b border-gray-100 bg-white sticky top-0 z-40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-blue-900" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('beranda')} active={route().current('beranda')}>
                                    Beranda
                                </NavLink>
                                <NavLink href={route('peta.index')} active={route().current('peta.index')}>
                                    Peta Kerusakan
                                </NavLink>
                                <NavLink href={route('laporan.create')} active={route().current('laporan.create')}>
                                    Buat Laporan
                                </NavLink>
                                {(user?.role === 'admin' || user?.role === 'kadis') && (
                                    <NavLink 
                                        href={route('admin.dashboard')} 
                                        active={route().current('admin.dashboard')}
                                        className="text-red-600 font-bold"
                                    >
                                        Dashboard Admin
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition hover:text-gray-700 focus:outline-none">
                                        {user.name}
                                        <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('laporan.saya')}>Laporan Saya</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Top Header */}
            <div className="sm:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40 flex justify-between items-center">
                <ApplicationLogo className="h-8 w-auto text-blue-900" />
                <button onClick={() => setShowMobileMenu(true)} className="p-2 text-gray-600">
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Bottom Tab Bar */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <Link href={route('beranda')} className={`flex flex-col items-center gap-1 ${route().current('beranda') ? 'text-blue-900' : 'text-gray-400'}`}>
                    <Home size={20} strokeWidth={route().current('beranda') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Beranda</span>
                </Link>
                <Link href={route('peta.index')} className={`flex flex-col items-center gap-1 ${route().current('peta.index') ? 'text-blue-900' : 'text-gray-400'}`}>
                    <Map size={20} strokeWidth={route().current('peta.index') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Peta</span>
                </Link>
                <Link href={route('laporan.create')} className="flex flex-col items-center gap-1 -mt-8">
                    <div className="bg-blue-900 text-white p-3 rounded-2xl shadow-lg shadow-blue-200 ring-4 ring-white">
                        <PlusCircle size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-900 mt-1">Lapor</span>
                </Link>
                <Link href={route('laporan.saya')} className={`flex flex-col items-center gap-1 ${route().current('laporan.saya') ? 'text-blue-900' : 'text-gray-400'}`}>
                    <ListChecks size={20} strokeWidth={route().current('laporan.saya') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Riwayat</span>
                </Link>
                <button onClick={() => setShowMobileMenu(true)} className="flex flex-col items-center gap-1 text-gray-400">
                    <User size={20} />
                    <span className="text-[10px] font-bold">Menu</span>
                </button>
            </div>

            {/* Fullscreen Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`absolute right-0 top-0 bottom-0 w-4/5 bg-white shadow-xl transition-transform duration-300 transform ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-black text-xl text-blue-900">SIPEKA Menu</h2>
                            <button onClick={() => setShowMobileMenu(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-2xl mb-6">
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Akun Saya</p>
                                <p className="font-bold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>

                            <Link href={route('profile.edit')} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition font-medium text-gray-700">
                                <User size={20} className="text-gray-400" /> Profil Pengguna
                            </Link>
                            <Link href={route('laporan.langkah')} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition font-medium text-gray-700">
                                <Info size={20} className="text-gray-400" /> Cara Melapor
                            </Link>
                            
                            {(user?.role === 'admin' || user?.role === 'kadis') && (
                                <Link href={route('admin.dashboard')} className="flex items-center gap-4 p-3 bg-red-50 text-red-600 rounded-xl transition font-bold">
                                    <LayoutDashboard size={20} /> Panel Admin
                                </Link>
                            )}

                            <div className="pt-4 border-t border-gray-100">
                                <Link href={route('logout')} method="post" as="button" className="flex items-center gap-4 p-3 w-full text-left text-red-500 font-bold">
                                    <LogOut size={20} /> Keluar Aplikasi
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            {header && (
                <header className="bg-white shadow-sm border-b border-gray-100">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}