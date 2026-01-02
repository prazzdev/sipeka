import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    Home, Map, PlusCircle, User, LayoutDashboard, 
    Info, ListChecks, LogOut, Menu, X, 
    PanelLeftClose, PanelLeftOpen 
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { server_time } = usePage().props;
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [loadTime, setLoadTime] = useState(0);
    
    // STATE BARU: Untuk kontrol buka/tutup sidebar desktop
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const isAdminPage = route().current('admin.*');

    useEffect(() => {
        const now = new Date().getTime();
        const diff = Math.abs((now - server_time) / 1000);
        setLoadTime(diff.toFixed(3));
    }, [server_time]);

    return (
        <div className={`min-h-screen bg-gray-50 flex ${isAdminPage ? 'flex-col sm:flex-row' : 'flex-col'}`}>
            
            {/* --- CONDITION 1: SIDEBAR (Hanya muncul di halaman Admin) --- */}
            {isAdminPage && (
                <aside className={`hidden sm:flex bg-white border-r border-gray-100 flex-col sticky top-0 h-screen z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                    <div className={`p-6 border-b border-gray-50 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                        {isSidebarOpen && (
                            <Link href="/"><ApplicationLogo className="h-10 w-auto text-blue-900" /></Link>
                        )}
                        {/* TOMBOL TOGGLE SIDEBAR */}
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            title={isSidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
                        >
                            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {isSidebarOpen && (
                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest px-3 mb-2">Admin Panel</p>
                        )}
                        
                        <SidebarLink 
                            href={route('admin.dashboard')} 
                            active={route().current('admin.dashboard')} 
                            icon={<LayoutDashboard size={20}/>}
                            isOpen={isSidebarOpen}
                        >
                            Dashboard
                        </SidebarLink>

                        <SidebarLink 
                            href={route('admin.laporan.index')} 
                            active={route().current('admin.laporan.index')} 
                            icon={<ListChecks size={20}/>}
                            isOpen={isSidebarOpen}
                        >
                            Kelola Laporan
                        </SidebarLink>

                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <SidebarLink href={route('beranda')} icon={<Home size={20}/>} isOpen={isSidebarOpen}>
                                User Site
                            </SidebarLink>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <UserAccountBox user={user} isOpen={isSidebarOpen} />
                    </div>
                </aside>
            )}

            {/* --- CONDITION 2: NAVBAR ATAS (Halaman User) --- */}
            {!isAdminPage && (
                <nav className="hidden sm:block border-b border-gray-100 bg-white sticky top-0 z-40">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/"><ApplicationLogo className="h-9 w-auto text-blue-900" /></Link>
                                </div>
                                <div className="hidden space-x-2 sm:-my-px sm:ms-10 sm:flex items-center">
                                    <NavLink href={route('beranda')} active={route().current('beranda')}>Beranda</NavLink>
                                    <NavLink href={route('peta.index')} active={route().current('peta.index')}>Peta Kerusakan</NavLink>
                                    <NavLink href={route('laporan.saya')} active={route().current('laporan.saya')}>Laporan Saya</NavLink>
                                    <NavLink href={route('laporan.create')} active={route().current('laporan.create')}>Buat Laporan</NavLink>
                                    {(user?.role === 'admin' || user?.role === 'kadis') && (
                                        <Link href={route('admin.dashboard')} className="text-red-600 font-bold px-3 py-2 rounded-lg hover:bg-red-50 text-sm transition">Dashboard Admin</Link>
                                    )}
                                </div>
                            </div>
                            <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 transition">
                                            {user.name}
                                            <ChevronDownIcon />
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Edit Profil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 font-bold">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* --- AREA UTAMA --- */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isAdminPage ? 'h-screen overflow-y-auto' : ''}`}>
                <div className="sm:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40 flex justify-between items-center">
                    <ApplicationLogo className="h-8 w-auto text-blue-900" />
                    <button onClick={() => setShowMobileMenu(true)} className="p-2 text-gray-600 focus:outline-none"><Menu size={24} /></button>
                </div>

                {header && (
                    <header className="bg-white border-b border-gray-100 shadow-sm">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                <main className="py-6 flex-grow">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
                </main>

                <footer className="hidden sm:block py-4 border-t border-gray-200 bg-white mt-auto">
                    <div className="mx-auto max-w-7xl px-8 flex justify-between items-center text-[9px] text-gray-400 font-mono uppercase tracking-widest">
                        <span>SIPEKA MADUKARA v2.6 - Collapsible Sidebar</span>
                        <span>Response Time: {loadTime}s</span>
                    </div>
                </footer>
            </div>

            <MobileNavigation showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} user={user} isAdminPage={isAdminPage} />
        </div>
    );
}

// --- HELPER COMPONENTS (Modified for Collapsible) ---



function SidebarLink({ href, active, icon, children, isOpen }) {
    return (
        <Link 
            href={href} 
            className={`flex items-center rounded-xl text-sm font-bold transition-all duration-200 group
                ${active ? 'bg-blue-50 text-blue-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                ${isOpen ? 'px-3 py-3 gap-3' : 'p-3 justify-center'}
            `}
            title={!isOpen ? children : ""}
        >
            <span className={`${active ? 'text-blue-900' : 'text-gray-400 group-hover:text-gray-600'}`}>{icon}</span>
            {isOpen && <span className="truncate">{children}</span>}
        </Link>
    );
}

function UserAccountBox({ user, isOpen }) {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button className={`flex items-center rounded-xl hover:bg-gray-50 transition text-left w-full ${isOpen ? 'gap-3 p-2' : 'justify-center p-1'}`}>
                    <div className="w-10 h-10 bg-blue-900 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold uppercase shadow-sm">
                        {user.name.charAt(0)}
                    </div>
                    {isOpen && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black">{user.role}</p>
                        </div>
                    )}
                </button>
            </Dropdown.Trigger>
            <Dropdown.Content align={isOpen ? "top" : "right"}>
                <Dropdown.Link href={route('profile.edit')}>Edit Profil</Dropdown.Link>
                <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 font-bold">Log Out</Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
}

// --- FUNGSI LAIN TETAP SAMA ---
function ChevronDownIcon() {
    return (
        <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    );
}

function MobileNavigation({ showMobileMenu, setShowMobileMenu, user, isAdminPage }) {
    return (
        <>
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <Link href={route('beranda')} className={`flex flex-col items-center gap-1 ${route().current('beranda') ? 'text-blue-900' : 'text-gray-400'}`}>
                    <Home size={20} /><span className="text-[10px] font-bold">Beranda</span>
                </Link>
                <Link href={route('peta.index')} className={`flex flex-col items-center gap-1 ${route().current('peta.index') ? 'text-blue-900' : 'text-gray-400'}`}>
                    <Map size={20} /><span className="text-[10px] font-bold">Peta</span>
                </Link>
                <Link href={route('laporan.create')} className="flex flex-col items-center gap-1 -mt-8">
                    <div className="bg-blue-900 text-white p-3 rounded-2xl shadow-lg ring-4 ring-white"><PlusCircle size={24} /></div>
                    <span className="text-[10px] font-bold text-blue-900 mt-1">Lapor</span>
                </Link>
                <Link href={route('laporan.saya')} className={`flex flex-col items-center gap-1 ${route().current('laporan.saya') ? 'text-blue-900' : 'text-gray-400'}`}>
                    <ListChecks size={20} /><span className="text-[10px] font-bold">Riwayat</span>
                </Link>
                <button onClick={() => setShowMobileMenu(true)} className="flex flex-col items-center gap-1 text-gray-400">
                    <User size={20} /><span className="text-[10px] font-bold">Menu</span>
                </button>
            </div>

            <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`absolute right-0 top-0 bottom-0 w-4/5 bg-white shadow-xl transition-transform duration-300 transform ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-black text-xl text-blue-900">SIPEKA Menu</h2>
                            <button onClick={() => setShowMobileMenu(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-2xl mb-6">
                                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Akun Saya</p>
                                <p className="font-bold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Link href={route('profile.edit')} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition font-medium text-gray-700"><User size={20} className="text-gray-400" /> Profil Pengguna</Link>
                            {(user?.role === 'admin' || user?.role === 'kadis') && (
                                <Link href={route('admin.dashboard')} className="flex items-center gap-4 p-3 bg-red-50 text-red-600 rounded-xl transition font-bold"><LayoutDashboard size={20} /> Panel Admin</Link>
                            )}
                            <div className="pt-4 border-t border-gray-100">
                                <Link href={route('logout')} method="post" as="button" className="flex items-center gap-4 p-3 w-full text-left text-red-500 font-bold"><LogOut size={20} /> Keluar Aplikasi</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}