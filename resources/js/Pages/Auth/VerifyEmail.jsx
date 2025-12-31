import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Send } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 text-blue-900 shadow-sm">
                    <Mail size={32} />
                </div>
                <h2 className="text-xl font-black text-blue-900 uppercase">Verifikasi Email Anda</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Terima kasih telah mendaftar! Sebelum mulai, silakan verifikasi email Anda dengan mengklik tautan yang baru saja kami kirimkan.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex flex-col gap-4 items-center">
                    <button
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-blue-800 transition active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
                    >
                        <Send size={18} />
                        {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-gray-500 hover:text-blue-900 font-bold underline"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}