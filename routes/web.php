<?php

use App\Models\Report;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UpvoteController;
use App\Http\Controllers\CommentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman Publik (Tanpa Login)
Route::get("/", function () {
    return Inertia::render("LandingPage", [
        "canLogin" => Route::has("login"),
        "canRegister" => Route::has("register"),
        "reports" => Report::select(
            "id",
            "judul_laporan",
            "status",
            "latitude",
            "longitude",
            "lokasi_detail",
        )->get(),
    ]);
})->name("landing");

// ==========================================
// ROUTE KHUSUS USER (ADMIN DILARANG MASUK)
// ==========================================
Route::middleware(["auth", "role:user"])->group(function () {
    Route::get("/laporan/buat", function () {
        return Inertia::render("User/CreateReport");
    })->name("laporan.create");

    Route::post("/laporan", [ReportController::class, "store"])->name(
        "laporan.store",
    );

    // Halaman Laporan Saya
    Route::get("/laporan-saya", [ReportController::class, "myReports"])->name(
        "laporan.saya",
    );

    // Toggle Upvote (Hanya User/Masyarakat)
    Route::post("/laporan/{report}/upvote", [
        UpvoteController::class,
        "toggle",
    ])->name("upvote.toggle");
});

// ==========================================
// ROUTE GLOBAL (Bisa diakses USER & ADMIN)
// ==========================================
Route::middleware("auth")->group(function () {
    Route::get("/profile", [ProfileController::class, "edit"])->name(
        "profile.edit",
    );
    Route::patch("/profile", [ProfileController::class, "update"])->name(
        "profile.update",
    );
    Route::delete("/profile", [ProfileController::class, "destroy"])->name(
        "profile.destroy",
    );

    // Detail Laporan & Hapus (Ditaruh DI BAWAH /laporan/buat agar tidak bentrok)
    Route::get("/laporan/{report}", [ReportController::class, "show"])->name(
        "laporan.show",
    );
    Route::delete("/laporan/{report}", [
        ReportController::class,
        "destroy",
    ])->name("laporan.destroy");
});

Route::middleware(["auth", "verified"])->group(function () {
    Route::get("/beranda", [ReportController::class, "index"])->name("beranda");
    Route::get("/peta", [ReportController::class, "map"])->name("peta.index");

    Route::get("/dashboard", function () {
        return redirect()->route("beranda");
    })->name("dashboard");
});

// ==========================================
// ROUTE KHUSUS ADMIN & KADIS
// ==========================================
Route::middleware(["auth", "role:admin"])->group(function () {
    // Dashboard & Statistik
    Route::get("/admin/dashboard", [
        ReportController::class,
        "adminDashboard",
    ])->name("admin.dashboard");
    Route::get("/admin/laporan", [ReportController::class, "adminIndex"])->name(
        "admin.laporan.index",
    );
    Route::get("/admin/export-pdf", [
        ReportController::class,
        "exportPdf",
    ])->name("admin.export");

    // Kelola Status Laporan
    Route::post("/admin/laporan/{report}/status", [
        ReportController::class,
        "updateStatus",
    ])->name("admin.status.update");
    Route::get("/admin/laporan/{report}/manage", [
        ReportController::class,
        "manage",
    ])->name("admin.report.manage");

    // Manajemen Komentar
    Route::post("/laporan/{report}/komentar", [
        CommentController::class,
        "store",
    ])->name("komentar.store");
    Route::patch("/admin/comment/{comment}", [
        CommentController::class,
        "update",
    ])->name("admin.comment.update");
    Route::delete("/admin/comment/{comment}", [
        CommentController::class,
        "destroy",
    ])->name("admin.comment.destroy");
});

require __DIR__ . "/auth.php";
