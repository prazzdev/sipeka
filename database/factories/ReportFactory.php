<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Daftar Desa di Kecamatan Madukara
        $desaMadukara = [
            'Babadan', 'Blitar', 'Clapar', 'Cutu', 'Dawuhan', 'Genter', 'Gununggiana', 
            'Kaliajir', 'Kutayasa', 'Limbangan', 'Madukara', 'Pagelak', 'Pagentan', 
            'Pakelen', 'Pekasiran', 'Rejasa', 'Sokayasa', 'Talunamba'
        ];

        // Judul & Deskripsi Khas Keluhan Jalan (Bahasa Indonesia)
        $judulLaporan = [
            'Jalan Berlubang Parah',
            'Aspal Mengelupas di Tanjakan',
            'Drainase Mampet Menyebabkan Banjir',
            'Jalan Ambles Akibat Longsor Kecil',
            'Penerangan Jalan Umum Mati',
            'Akses Jalan Utama Terputus',
            'Banyak Kerikil Tajam Membahayakan',
        ];

        $deskripsiLaporan = [
            'Mohon segera diperbaiki karena sering menyebabkan kecelakaan bagi pengendara motor.',
            'Kondisi jalan sudah rusak parah selama 3 bulan terakhir, apalagi saat musim hujan.',
            'Warga sudah mencoba menambal sendiri tapi aspal tetap mengelupas kembali.',
            'Akses ekonomi warga terhambat karena truk pengangkut hasil bumi sulit lewat.',
            'Sangat berbahaya jika dilewati malam hari karena minim penerangan dan jalan bergelombang.',
        ];
        
        $status = ['menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak'];
        
        return [
            'user_id' => \App\Models\User::where('role', 'user')->inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'judul_laporan' => fake()->randomElement($judulLaporan) . ' di Desa ' . fake()->randomElement($desaMadukara),
            'lokasi_detail' => 'RT 0' . fake()->numberBetween(1, 5) . ' RW 0' . fake()->numberBetween(1, 3) . ', Desa ' . fake()->randomElement($desaMadukara) . ', Kec. Madukara',
            'latitude' => fake()->latitude(-7.40, -7.38), 
            'longitude' => fake()->longitude(109.68, 109.72),
            'deskripsi' => fake()->randomElement($deskripsiLaporan),
            'foto_jalan' => null, 
            'status' => fake()->randomElement($status),
            'total_upvote' => fake()->numberBetween(0, 100),
            'created_at' => fake()->dateTimeBetween('-2 months', 'now'),
        ];
    }
}
