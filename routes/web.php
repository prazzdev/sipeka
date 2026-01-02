<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UpvoteController;
use App\Http\Controllers\CommentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('landing');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Halaman Detail Laporan
    Route::get('/laporan/{report}', [ReportController::class, 'show'])->name('laporan.show');
    // Hapus Laporan
    Route::delete('/laporan/{report}', [ReportController::class, 'destroy'])->name('laporan.destroy');
    // Halaman Laporan Saya
    Route::get('/laporan-saya', [ReportController::class, 'myReports'])->name('laporan.saya');

    // Halaman Langkah Melapor
    Route::get('/langkah-melapor', function () {
        return Inertia::render('User/LangkahMelapor');
    })->name('laporan.langkah');
});

// Route khusus Admin & Kadis
Route::middleware(['auth', 'role:admin,kadis'])->group(function () {
    // 1. Route Dashboard (Hanya Statistik)
    Route::get('/admin/dashboard', [ReportController::class, 'adminDashboard'])->name('admin.dashboard');
    
    // 2. Route Manajemen Laporan (Hanya Tabel) - INI YANG BARU
    Route::get('/admin/laporan', [ReportController::class, 'adminIndex'])->name('admin.laporan.index');
    
    Route::get('/admin/export-pdf', [ReportController::class, 'exportPdf'])->name('admin.export');
    
    // Halaman kelola laporan & update status
    Route::post('/admin/laporan/{report}/status', [ReportController::class, 'updateStatus'])->name('admin.status.update');
    Route::get('/admin/laporan/{report}/manage', [ReportController::class, 'manage'])->name('admin.report.manage');
    
    // Action Komentar
    Route::post('/laporan/{report}/komentar', [CommentController::class, 'store'])->name('komentar.store');
    Route::patch('/admin/comment/{comment}', [CommentController::class, 'update'])->name('admin.comment.update');
    Route::delete('/admin/comment/{comment}', [CommentController::class, 'destroy'])->name('admin.comment.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Beranda SIPEKA
    Route::get('/beranda', [ReportController::class, 'index'])->name('beranda');

    Route::get('/dashboard', function () {
        return redirect()->route('beranda');
    })->name('dashboard');
    
    // Simpan Laporan
    Route::post('/laporan', [ReportController::class, 'store'])->name('laporan.store');

    // Halaman Buat Laporan
    Route::get('/laporan/buat', function () {
        return Inertia::render('User/CreateReport');
    })->name('laporan.create');

    // Halaman Peta
    Route::get('/peta', [ReportController::class, 'map'])->name('peta.index');

    // Toggle Upvote
    Route::post('/laporan/{report}/upvote', [UpvoteController::class, 'toggle'])->name('upvote.toggle');
});

require __DIR__.'/auth.php';