<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request) 
    {
        $query = Report::with(['user', 'comments']) // Pastikan load comments untuk timeline
            ->withExists(['upvotes as upvoted' => function($query) {
                $query->where('user_id', auth()->id());
            }]);

        // Logika Filter Sorting
        if ($request->sort === 'populer') {
            // Urutkan berdasarkan total_upvote terbanyak
            $query->orderBy('total_upvote', 'desc');
        } else {
            // Default: Terbaru (Gunakan latest() di sini saja)
            $query->latest();
        }

        $reports = $query->paginate(10)->withQueryString();

        return Inertia::render('User/Beranda', [
            'reports' => $reports,
            'filters' => $request->only(['sort']) 
        ]);
    }
    // Menyimpan laporan baru ke database
    public function store(Request $request)
    {
        // 1. Validasi Data
        $request->validate([
            'judul_laporan' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'foto_jalan' => 'required|image|mimes:jpg,jpeg,png|max:2048', 
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'lokasi_detail' => 'required|string',
        ]);

        // 2. Proses Upload Foto
        $path = null;
        if ($request->hasFile('foto_jalan')) {
            $path = $request->file('foto_jalan')->store('laporan-jalan', 'public');
        }

        // 3. Simpan ke Database (Tampung hasil create ke variabel $report)
        $report = Report::create([
            'user_id' => auth()->id(),
            'nomor_laporan' => null, 
            'judul_laporan' => $request->judul_laporan,
            'deskripsi' => $request->deskripsi,
            'foto_jalan' => $path,
            'lokasi_kecamatan' => 'Madukara', 
            'lokasi_detail' => $request->lokasi_detail,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'status' => 'menunggu', 
            'total_upvote' => 0,
        ]);

        // 4. Buat Log Awal di Tabel Comments
        $report->comments()->create([
            'user_id' => auth()->id(),
            'pesan' => 'Laporan berhasil dibuat dan sedang mengantre untuk diverifikasi oleh admin.',
            'status' => 'menunggu',
            'foto_tanggapan' => null, // Warga tidak mengirim foto tanggapan di awal
        ]);

        // 5. Redirect
        return redirect()->route('beranda')->with('message', 'Laporan berhasil dikirim dan akan segera diverifikasi!');
    }
    
    // Halaman Detail Laporan
    public function show(Report $report)
    {
        // Ambil detail laporan beserta pengunggahnya
        // Kita tambahkan orderBy agar histori progres urut dari yang terlama ke terbaru
        $report->load(['user', 'comments' => function($query) {
            $query->orderBy('created_at', 'asc');
        }, 'comments.user']);
        
        // Cek apakah user login sudah upvote untuk status tombol di detail
        $report->upvoted = $report->upvotes()->where('user_id', auth()->id())->exists();

        return Inertia::render('User/DetailReport', [
            'report' => $report
        ]);
    }

    public function map(Request $request)
    {
        // Default tahun ini, dan bulan bisa default ke 'all' atau bulan ini
        $selectedMonth = $request->month ?? date('m'); 
        $selectedYear = $request->year ?? date('Y');

        $query = Report::query();

        // Filter Tahun (Selalu dijalankan)
        $query->whereYear('created_at', $selectedYear);

        // Filter Bulan (Hanya jika bukan 'all')
        if ($selectedMonth !== 'all') {
            $query->whereMonth('created_at', $selectedMonth);
        }

        $reports = $query->get();

        return Inertia::render('User/Map', [
            'reports' => $reports,
            'filters' => [
                'month' => $selectedMonth,
                'year' => (string)$selectedYear
            ]
        ]);
    }

    public function adminDashboard(Request $request)
    {
        // Ambil parameter dari request
        $statusFilter = $request->query('status');
        $sortBy = $request->query('sort', 'latest');
        $search = $request->query('search');
        $monthFilter = $request->query('month'); 
        $yearFilter = $request->query('year');

        $query = Report::with('user');

        // 1. Fitur Search (Nomor Laporan, Judul, atau Nama Pelapor)
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nomor_laporan', 'like', "%{$search}%")
                ->orWhere('judul_laporan', 'like', "%{$search}%")
                ->orWhereHas('user', function($u) use ($search) {
                    $u->where('name', 'like', "%{$search}%");
                });
            });
        }

        // 2. Fitur Filter Status
        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        // --- Filter Bulan & Tahun (Baru) ---
        if ($monthFilter && $monthFilter !== 'all') {
            $query->whereMonth('created_at', $monthFilter);
        }
        if ($yearFilter) {
            $query->whereYear('created_at', $yearFilter);
        }

        // 3. Fitur Sorting
        if ($sortBy === 'upvote') {
            $query->orderBy('total_upvote', 'desc');
        } else {
            $query->latest();
        }

        $reports = $query->paginate(10)->withQueryString();
        
        // Kita buat clone query agar tidak terganggu pagination
        $statQuery = clone $query;

        // 4. Statistik Lengkap
        // --- Statistik (Gunakan Query yang sama agar sinkron) ---
        
        $stats = [
            'total' => $statQuery->count(),
            'pending' => (clone $statQuery)->where('status', 'menunggu')->count(),
            'proses' => (clone $statQuery)->where('status', 'diproses')->count(),
            'selesai' => (clone $statQuery)->where('status', 'selesai')->count(),
            'hari_ini' => Report::whereDate('created_at', now())->count(), // Tetap global
            'bulan_ini' => Report::whereMonth('created_at', now()->month)->count(), // Tetap global
        ];

        return Inertia::render('Admin/Dashboard', [
            'reports' => $reports,
            'stats' => $stats,
            'filters' => $request->only(['status', 'sort', 'search', 'month', 'year'])
        ]);
    }

    public function updateStatus(Request $request, Report $report)
    {
        $request->validate([
            'status' => 'required|in:menunggu,diverifikasi,diproses,selesai,ditolak',
            'pesan' => 'required|string|min:5',
            'foto_tanggapan' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('foto_tanggapan')) {
            $path = $request->file('foto_tanggapan')->store('tanggapan-admin', 'public');
        }

        // Menggunakan DB Transaction agar aman
        \DB::transaction(function () use ($request, $report, $path) {
            // 1. Update status laporan
            $report->update([
                'status' => $request->status
            ]);

            // 2. Buat tanggapan/histori
            $report->comments()->create([
                'user_id' => auth()->id(),
                'pesan' => $request->pesan,
                'status' => $request->status,
                'foto_tanggapan' => $path, 
            ]);
        });

        return redirect()->back()->with('message', 'Progres laporan berhasil diperbarui!');
    }

    public function exportPdf(Request $request)
    {
        // 1. Ambil parameter filter (Termasuk Bulan dan Tahun)
        $statusFilter = $request->query('status');
        $search = $request->query('search');
        $sortBy = $request->query('sort', 'latest');
        $monthFilter = $request->query('month'); 
        $yearFilter = $request->query('year');

        // 2. Bangun Query
        $query = Report::with('user');

        // Fitur Search
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nomor_laporan', 'like', "%{$search}%")
                ->orWhere('judul_laporan', 'like', "%{$search}%")
                ->orWhereHas('user', function($u) use ($search) {
                    $u->where('name', 'like', "%{$search}%");
                });
            });
        }

        // Fitur Filter Status
        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        // Fitur Filter Bulan & Tahun (Sinkron dengan Dashboard)
        if ($monthFilter && $monthFilter !== 'all') {
            $query->whereMonth('created_at', $monthFilter);
        }
        if ($yearFilter) {
            $query->whereYear('created_at', $yearFilter);
        }

        // Fitur Sorting
        if ($sortBy === 'upvote') {
            $query->orderBy('total_upvote', 'desc');
        } else {
            $query->latest();
        }

        // 3. Ambil data
        $reports = $query->get();

        // 4. Logika Penamaan File yang Dinamis & Informatif
        $dateNow = now()->format('d-m-Y');
        $statusName = $statusFilter ? ucfirst($statusFilter) : 'Semua-Status';
        $monthName = ($monthFilter && $monthFilter !== 'all') ? "-Bulan-{$monthFilter}" : "";
        $yearName = $yearFilter ? "-Tahun-{$yearFilter}" : "";
        
        // Contoh: Laporan_SIPEKA_Selesai-Bulan-01-Tahun-2025_27-12-2025.pdf
        $fileName = "Laporan_SIPEKA_{$statusName}{$monthName}{$yearName}_{$dateNow}.pdf";

        // 5. Generate PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.reports', [
            'reports' => $reports,
            'status' => $statusFilter,
            'month' => $monthFilter,
            'year' => $yearFilter,
            'date' => $dateNow
        ]);

        // 6. Download file
        return $pdf->download($fileName);
    }

    public function manage(Report $report)
    {
        // Load komentar beserta user admin yang membuatnya
        $report->load(['comments.user', 'user']);
        
        return Inertia::render('Admin/Reports/Manage', [
            'report' => $report
        ]);
    }

    public function destroy(Report $report)
    {
        // Proteksi: Hanya pemilik laporan atau admin yang boleh menghapus
        if (auth()->id() !== $report->user_id && auth()->user()->role !== 'admin') {
            abort(403, 'Anda tidak memiliki otoritas.');
        }

        // Hapus file foto dari folder storage agar tidak menumpuk sampah
        if ($report->foto_jalan) {
            Storage::disk('public')->delete($report->foto_jalan);
        }

        $report->delete();

        return redirect()->route('beranda')->with('message', 'Laporan berhasil dihapus.');
    }

    public function myReports()
    {
        $reports = Report::where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('User/MyReports', [
            'reports' => $reports
        ]);
    }
}
