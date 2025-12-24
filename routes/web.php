<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UpvoteController;
use App\Http\Controllers\CommentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\RoleMiddleware;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Halaman Buat Laporan
    Route::get('/laporan/buat', function () {
        return Inertia::render('User/CreateReport');
    })->name('laporan.create');
    
    // Halaman Detail Laporan
    Route::get('/laporan/{report}', [ReportController::class, 'show'])->name('laporan.show');
    // Hapus Laporan
    Route::delete('/laporan/{report}', [ReportController::class, 'destroy'])->name('laporan.destroy');

    // Halaman Peta
    Route::get('/peta', [ReportController::class, 'map'])->name('peta.index');
});

// Route khusus Admin & Kadis
Route::middleware(['auth', 'role:admin,kadis'])->group(function () {
    Route::get('/admin/dashboard', [ReportController::class, 'adminDashboard'])->name('admin.dashboard');
    Route::patch('/admin/laporan/{report}/status', [ReportController::class, 'updateStatus'])->name('admin.status.update');
    Route::get('/admin/export-pdf', [ReportController::class, 'exportPdf'])->name('admin.export');

    // Komentar pada Laporan
    Route::post('/laporan/{report}/komentar', [CommentController::class, 'store'])->name('komentar.store');

    Route::delete('/komentar/{comment}', [CommentController::class, 'destroy'])->name('komentar.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Beranda SIPEKA
    Route::get('/beranda', [ReportController::class, 'index'])->name('beranda');

    // Tambahkan baris ini di bawah route beranda Anda
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
