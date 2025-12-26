import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getStatusColor } from "@/Helpers/getStatusColor";
import { Link } from "@inertiajs/react";

// Isi MyReports.jsx secara garis besar
export default function MyReports({ auth, reports }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2>Riwayat Laporan Saya</h2>}>
            <div className="max-w-4xl mx-auto py-6 px-4">
                {reports.data.length > 0 ? (
                    reports.data.map((report) => (
                        <div key={report.id} className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-blue-500 uppercase">#{report.nomor_laporan}</span>
                                <h3 className="font-bold text-gray-800">{report.judul_laporan}</h3>
                                <p className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString('id-ID')}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(report.status)}`}>
                                    {report.status}
                                </span>
                                <Link href={route('laporan.show', report.id)} className="text-blue-900 text-xs font-bold underline">
                                    Lihat Detail
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">Anda belum pernah membuat laporan.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}