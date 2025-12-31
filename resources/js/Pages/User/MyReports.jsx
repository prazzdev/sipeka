import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getStatusColor } from "@/Helpers/getStatusColor";
import { Link, Head } from "@inertiajs/react";
import { FileText, Calendar, ArrowRight, MessageCircle } from "lucide-react";

export default function MyReports({ auth, reports }) {
    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-bold text-xl text-blue-900 leading-tight text-center sm:text-left">Riwayat Laporan Saya</h2>}
        >
            <Head title="Riwayat Laporan" />
            
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <p className="text-gray-500 text-sm">Pantau perkembangan seluruh laporan jalan rusak yang telah Anda kirimkan.</p>
                </div>

                {reports.data.length > 0 ? (
                    <div className="grid gap-4">
                        {reports.data.map((report) => (
                            <div key={report.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-shadow group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest border border-blue-100 uppercase">
                                            #{report.nomor_laporan}
                                        </span>
                                        <div className="flex items-center text-gray-400 text-[10px] gap-1 font-medium uppercase tracking-tighter">
                                            <Calendar size={12} />
                                            {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <h3 className="font-black text-blue-900 text-lg group-hover:text-blue-700 transition-colors">{report.judul_laporan}</h3>
                                    <div className="flex items-center gap-4 pt-1">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                                    <Link 
                                        href={route('laporan.show', report.id)} 
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-900 hover:text-white text-blue-900 px-5 py-2.5 rounded-xl text-xs font-black transition-all group/btn shadow-sm"
                                    >
                                        LIHAT PROGRES
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-inner">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-gray-900 font-black text-xl mb-2">Belum Ada Laporan</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8">Anda belum pernah mengirim laporan kerusakan jalan di wilayah Madukara.</p>
                        <Link 
                            href={route('laporan.create')} 
                            className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-100"
                        >
                            Buat Laporan Sekarang
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}