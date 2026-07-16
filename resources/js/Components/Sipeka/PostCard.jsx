import React, { useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import {
    MapPin,
    ArrowBigUp,
    Share2,
    MoreVertical,
    Link as LinkIcon,
    Check,
    AlertTriangle,
    ExternalLink,
    Trash2,
    Edit,
    ThumbsUp,
} from "lucide-react";
import Swal from "sweetalert2";

export default function PostCard({ report, auth }) {
    const { post, processing } = useForm();
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const shareUrl = `${window.location.origin}/laporan/${report.id}`;
    const shareTitle = `SIPEKA: Mohon perhatian, ada jalan rusak di ${report.lokasi_detail}`;

    // Cek apakah pengguna saat ini adalah admin
    const isAdmin = auth?.user?.role === "admin";

    const handleUpvote = () => {
        if (isAdmin) return; // Proteksi tambahan di sisi frontend

        post(route("upvote.toggle", report?.id), {
            preserveScroll: true,
            onSuccess: () => {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "bottom-end",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.style.zIndex = "9999";
                    },
                });

                Toast.fire({
                    icon: "success",
                    title: "Dukungan diperbarui",
                });
            },
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "SIPEKA Madukara",
                    text: shareTitle,
                    url: shareUrl,
                });
            } catch (err) {
                console.log("Batal berbagi:", err);
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = () => {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus laporan ini secara permanen?",
            )
        ) {
            router.delete(route("laporan.destroy", report.id), {
                preserveScroll: true,
                onSuccess: () => setShowMenu(false),
            });
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
                        {report.user.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900">
                            {report.user.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {new Date(report.created_at).toLocaleDateString(
                                "ID",
                                "id",
                            )}
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                        <MoreVertical size={20} className="text-gray-500" />
                    </button>

                    {/* DROPDOWN MENU */}
                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            ></div>

                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-150">
                                <Link
                                    href={route("laporan.show", report.id)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                >
                                    <ExternalLink size={16} className="mr-2" />{" "}
                                    Lihat Detail
                                </Link>

                                {auth.user.id === report.user_id || isAdmin ? (
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-50"
                                    >
                                        <Trash2 size={16} className="mr-2" />{" "}
                                        Hapus Laporan
                                    </button>
                                ) : (
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition border-t border-gray-50">
                                        <AlertTriangle
                                            size={16}
                                            className="mr-2"
                                        />{" "}
                                        Laporkan Spam
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Link href={route("laporan.show", report?.id)}>
                <div className="relative aspect-video bg-gray-100">
                    {report.foto_jalan !== null ? (
                        <img
                            src={`/storage/${report.foto_jalan}`}
                            alt="Kerusakan Jalan"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={`/storage/no-image.png`}
                            alt="Gambar tidak tersedia untuk laporan ini"
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${
                                report.status === "selesai"
                                    ? "bg-green-500 text-white"
                                    : report.status === "ditolak"
                                      ? "bg-red-100 text-red-600"
                                      : report.status === "diproses"
                                        ? "bg-blue-500 text-white"
                                        : report.status === "diverifikasi"
                                          ? "bg-indigo-500 text-white"
                                          : "bg-yellow-400 text-blue-900"
                            }`}
                        >
                            {report.status}
                        </span>
                    </div>
                </div>
            </Link>

            <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                        <ArrowBigUp
                            size={16}
                            className="text-blue-600 fill-current"
                        />
                        <span className="text-[11px] sm:text-xs font-black text-blue-900 ml-1 uppercase tracking-wider">
                            {report.total_upvote} Warga mendukung perbaikan
                        </span>
                    </div>
                </div>
                <Link href={route("laporan.show", report?.id)}>
                    <h3 className="font-bold text-lg text-blue-900 mb-1 hover:underline cursor-pointer">
                        {report.judul_laporan}
                    </h3>
                </Link>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin size={14} className="mr-1 text-red-500" />
                    <span className="truncate">{report.lokasi_detail}</span>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                    {report.deskripsi}
                </p>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2 font-sans">
                    {/* HANYA MUNCUL JIKA BUKAN ADMIN */}
                    {!isAdmin && (
                        <button
                            onClick={handleUpvote}
                            disabled={processing}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm ${
                                report.upvoted
                                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                    : "bg-blue-900 text-white hover:bg-blue-800 shadow-blue-100 animate-shake"
                            }`}
                        >
                            {report.upvoted ? (
                                <>
                                    <Check size={18} />
                                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider">
                                        Sudah Didukung
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ThumbsUp size={18} />
                                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider">
                                        Klik untuk Dukungan
                                    </span>
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={handleShare}
                        className={`flex items-center justify-center p-2.5 rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all active:scale-95 ${
                            isAdmin
                                ? "flex-1 py-2.5 font-bold text-xs uppercase tracking-wider space-x-2"
                                : ""
                        }`}
                    >
                        {copied ? (
                            <Check size={20} className="text-green-500" />
                        ) : (
                            <Share2 size={20} />
                        )}
                        {/* Jika admin, tambahkan teks pendukung agar tombol share terlihat proporsional saat penuh */}
                        {isAdmin && (
                            <span className="text-gray-600 text-xs font-black uppercase tracking-wider ml-1">
                                Bagikan Laporan
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
