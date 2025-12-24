<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    // Menampilkan halaman Beranda (Feed)
    public function index()
    {
        $reports = Report::with('user')
            ->withExists(['upvotes as upvoted' => function($query) {
                $query->where('user_id', auth()->id());
            }])
            ->latest()
            ->get();

        return Inertia::render('User/Beranda', [
            'reports' => $reports
        ]);
    }
    // Menyimpan laporan baru ke database
    public function store(Request $request)
    {
        $request->validate([
            'judul_laporan' => 'required|string|max:255',
            'deskripsi' => 'required',
            'foto_jalan' => 'required|image|mimes:jpg,jpeg,png|max:2048', // Max 2MB
            'latitude' => 'required',
            'longitude' => 'required',
            'lokasi_detail' => 'required',
        ]);

        // Proses Upload Foto
        if ($request->hasFile('foto_jalan')) {
            $path = $request->file('foto_jalan')->store('laporan-jalan', 'public');
        }

        Report::create([
            'user_id' => auth()->id(),
            'judul_laporan' => $request->judul_laporan,
            'deskripsi' => $request->deskripsi,
            'foto_jalan' => $path,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'lokasi_detail' => $request->lokasi_detail,
            'status' => 'menunggu', // Default status
        ]);

        return redirect()->back()->with('message', 'Laporan berhasil dikirim!');
    }
    
    // Halaman Detail Laporan
    public function show(Report $report)
    {
        // Ambil detail laporan beserta pengunggahnya
        $report->load(['user', 'comments.user']);
        
        // Cek apakah user login sudah upvote untuk status tombol di detail
        $report->upvoted = $report->upvotes()->where('user_id', auth()->id())->exists();

        return Inertia::render('User/DetailReport', [
            'report' => $report
        ]);
    }

    public function map()
    {
        $reports = Report::all(); // Mengambil semua titik koordinat
        return Inertia::render('User/Map', [
            'reports' => $reports
        ]);
    }

    // Halaman Dashboard Admin/Kadis
    public function adminDashboard(Request $request)
    {
        // Ambil parameter dari request (query string)
        $statusFilter = $request->query('status');
        $sortBy = $request->query('sort', 'latest'); // Default: terbaru

        $query = Report::with('user');

        // Fitur Filter Status
        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        // Fitur Sorting
        if ($sortBy === 'upvote') {
            $query->orderBy('total_upvote', 'desc'); // Upvote terbanyak di atas
        } else {
            $query->latest(); // Default: Tanggal terbaru
        }

        $reports = $query->get();
        
        $stats = [
            'total' => Report::count(),
            'pending' => Report::where('status', 'menunggu')->count(),
            'proses' => Report::where('status', 'diproses')->count(),
            'selesai' => Report::where('status', 'selesai')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'reports' => $reports,
            'stats' => $stats,
            'filters' => $request->only(['status', 'sort']) // Kirim balik status filter aktif
        ]);
    }

    public function updateStatus(Request $request, Report $report)
    {
        $request->validate(['status' => 'required|in:menunggu,diverifikasi,diproses,selesai']);
        
        $report->update(['status' => $request->status]);

        return redirect()->back()->with('message', 'Status laporan berhasil diperbarui!');
    }

    public function exportPdf(Request $request)
    {
        $statusFilter = $request->query('status');
        $query = Report::with('user');

        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        $reports = $query->latest()->get();

        // Data yang akan dikirim ke view PDF
        $data = [
            'title' => 'Laporan Kerusakan Jalan Kecamatan Madukara',
            'date' => date('d/m/Y'),
            'reports' => $reports,
            'status' => $statusFilter ?? 'Semua'
        ];

        $pdf = Pdf::loadView('pdf.reports', $data);
        
        // Download file PDF
        return $pdf->download('laporan-sipeka-' . date('Y-m-d') . '.pdf');
    }
}
