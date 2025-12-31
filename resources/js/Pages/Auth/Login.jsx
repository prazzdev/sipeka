import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn, Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil Masuk!',
                    text: 'Selamat datang kembali di SIPEKA.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Gagal Login!',
                    text: 'Email atau password yang Anda masukkan salah.',
                    icon: 'error',
                    confirmButtonColor: '#1e3a8a',
                });
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Header Login */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 text-blue-900 shadow-sm">
                    <LogIn size={32} />
                </div>
                <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Selamat Datang</h2>
                <p className="text-sm text-gray-500 mt-1 italic">Masuk untuk mulai memantau jalan Madukara</p>
            </div>

            {status && (
                <div className="mb-6 text-sm font-medium text-green-600 bg-green-50 p-4 rounded-xl border border-green-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
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
                        placeholder="nama@email.com"
                        value={data.email}
                        className="mt-1 block w-full border-gray-200 focus:border-blue-900 focus:ring-blue-900 rounded-xl shadow-sm transition-all"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
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
                        placeholder="••••••••"
                        value={data.password}
                        className="mt-1 block w-full border-gray-200 focus:border-blue-900 focus:ring-blue-900 rounded-xl shadow-sm transition-all"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-gray-300 text-blue-900 shadow-sm focus:ring-blue-900"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600 group-hover:text-blue-900 transition font-medium">Ingat saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-blue-600 font-bold hover:text-blue-800 transition uppercase tracking-tighter"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                {/* Login Button */}
                <div className="pt-4">
                    <button
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-3 bg-blue-900 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
                    >
                        {processing ? 'Memproses...' : 'Masuk Sekarang'}
                    </button>
                </div>

                {/* Register Link */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        Belum memiliki akun SIPEKA?{' '}
                        <Link
                            href={route('register')}
                            className="font-black text-blue-900 hover:text-blue-700 transition decoration-yellow-400 decoration-2 underline-offset-4 hover:underline"
                        >
                            DAFTAR DISINI
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}