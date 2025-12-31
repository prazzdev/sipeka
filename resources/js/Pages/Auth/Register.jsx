import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onSuccess: () => {
                Swal.fire({
                    title: 'Pendaftaran Berhasil!',
                    text: 'Akun Anda telah dibuat. Silakan mulai gunakan SIPEKA.',
                    icon: 'success',
                    confirmButtonColor: '#1e3a8a',
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Gagal Mendaftar!',
                    text: 'Pastikan data yang Anda isi sudah benar sesuai ketentuan.',
                    icon: 'error',
                    confirmButtonColor: '#1e3a8a',
                });
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun" />

            {/* Header Section */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 text-blue-900 shadow-sm">
                    <UserPlus size={32} />
                </div>
                <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Buat Akun Baru</h2>
                <p className="text-sm text-gray-500 mt-1 italic">Bergabunglah untuk membantu perbaikan jalan</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* Name Field */}
                <div className="group">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <InputLabel htmlFor="name" value="Nama Lengkap" className="font-bold text-gray-700 uppercase text-xs tracking-wider" />
                        <User size={16} className="text-gray-400 group-focus-within:text-blue-900 transition-colors" />
                    </div>

                    <TextInput
                        id="name"
                        name="name"
                        placeholder="Masukkan nama sesuai KTP"
                        value={data.name}
                        className="mt-1 block w-full border-gray-200 focus:border-blue-900 focus:ring-blue-900 rounded-xl shadow-sm transition-all"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Email Field */}
                <div className="group">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <InputLabel htmlFor="email" value="Alamat Email" className="font-bold text-gray-700 uppercase text-xs tracking-wider" />
                        <Mail size={16} className="text-gray-400 group-focus-within:text-blue-900 transition-colors" />
                    </div>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="email@anda.com"
                        value={data.email}
                        className="mt-1 block w-full border-gray-200 focus:border-blue-900 focus:ring-blue-900 rounded-xl shadow-sm transition-all"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password Field */}
                <div className="group">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <InputLabel htmlFor="password" value="Kata Sandi" className="font-bold text-gray-700 uppercase text-xs tracking-wider" />
                        <Lock size={16} className="text-gray-400 group-focus-within:text-blue-900 transition-colors" />
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Minimal 8 karakter"
                        value={data.password}
                        className="mt-1 block w-full border-gray-200 focus:border-blue-900 focus:ring-blue-900 rounded-xl shadow-sm transition-all"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Sandi" className="font-bold text-gray-700 uppercase text-xs tracking-wider" />
                        <CheckCircle2 size={16} className="text-gray-400 group-focus-within:text-blue-900 transition-colors" />
                    </div>

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        placeholder="Ulangi kata sandi"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-gray-200 focus:border-blue-900 focus:ring-blue-900 rounded-xl shadow-sm transition-all"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-3 bg-blue-900 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
                    >
                        {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                    </button>
                </div>

                {/* Login Link */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        Sudah memiliki akun SIPEKA?{' '}
                        <Link
                            href={route('login')}
                            className="font-black text-blue-900 hover:text-blue-700 transition decoration-yellow-400 decoration-2 underline-offset-4 hover:underline"
                        >
                            MASUK DISINI
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}