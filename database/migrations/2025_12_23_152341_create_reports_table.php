<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Pengunggah
            $table->string('foto_jalan')->nullable(); // Nama file/path foto
            $table->string('judul_laporan'); // Contoh: Jalan Berlubang Madukara
            $table->text('deskripsi');
            $table->string('lokasi_kecamatan')->default('Madukara');
            $table->string('lokasi_detail'); // Alamat manual
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->enum('status', ['menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak'])->default('menunggu');
            $table->text('alasan_ditolak')->nullable();
            $table->integer('total_upvote')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
