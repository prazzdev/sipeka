import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn, Mail, Lock } from 'lucide-react';

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
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Header Login */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Selamat Datang</h2>
                <p className="text-sm text-gray-500 mt-1">Silakan masuk ke akun SIPEKA Anda</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <InputLabel htmlFor="email" value="Email" className="font-bold text-gray-700" />
                        <Mail size={14} className="text-gray-400" />
                    </div>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="nama@email.com"
                        value={data.email}
                        className="mt-1 block w-full border-gray-200 focus:border-blue-900 focus:ring-blue-900 rounded-xl shadow-sm"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <InputLabel htmlFor="password" value="Password" className="font-bold text-gray-700" />
                        <Lock size={14} className="text-gray-400" />
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={data.password}
                        className="mt-1 block w-full border-gray-200 focus:border-blue-900 focus:ring-blue-900 rounded-xl shadow-sm"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-gray-300 text-blue-900 shadow-sm focus:ring-blue-900"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600 group-hover:text-blue-900 transition">Ingat saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition underline-offset-4 hover:underline"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                {/* Login Button */}
                <div className="pt-2">
                    <button
                        disabled={processing}
                        className={`w-full flex items-center justify-center gap-2 bg-blue-900 text-white font-black py-3.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-800 transition active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm`}
                    >
                        <LogIn size={18} />
                        {processing ? 'Sedang Masuk...' : 'Masuk Sekarang'}
                    </button>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Belum punya akun?{' '}
                    <Link
                        href={route('register')}
                        className="font-bold text-blue-900 hover:text-blue-700 underline"
                    >
                        Daftar Gratis
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}