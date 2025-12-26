<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\User;
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
    // Variabel statis untuk menyimpan jumlah urutan per hari di memori
    protected static array $sequences = [];

    public function definition(): array
    {
        $desaMadukara = [
            'Babadan', 'Blitar', 'Clapar', 'Cutu', 'Dawuhan', 'Genter', 'Gununggiana', 
            'Kaliajir', 'Kutayasa', 'Limbangan', 'Madukara', 'Pagelak', 'Pagentan', 
            'Pakelen', 'Pekasiran', 'Rejasa', 'Sokayasa', 'Talunamba'
        ];

        $judulLaporan = [
            'Jalan Berlubang Parah', 'Aspal Mengelupas di Tanjakan', 'Drainase Mampet Menyebabkan Banjir',
            'Jalan Ambles Akibat Longsor Kecil', 'Penerangan Jalan Umum Mati', 'Akses Jalan Utama Terputus'
        ];

        $status = ['menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak'];

        // Tentukan tanggal
        $createdAt = fake()->dateTimeBetween('-2 months', 'now');
        $datePrefix = $createdAt->format('ymd');

        // LOGIKA URUTAN: Menggunakan array statis agar tidak tabrakan
        if (!isset(self::$sequences[$datePrefix])) {
            self::$sequences[$datePrefix] = 1;
        } else {
            self::$sequences[$datePrefix]++;
        }

        $sequence = str_pad(self::$sequences[$datePrefix], 2, '0', STR_PAD_LEFT);
        $nomorLaporan = $datePrefix . $sequence;

        return [
            'user_id' => User::where('role', 'user')->inRandomOrder()->first()?->id ?? User::factory(),
            'nomor_laporan' => $nomorLaporan,
            'judul_laporan' => fake()->randomElement($judulLaporan) . ' di Desa ' . fake()->randomElement($desaMadukara),
            'lokasi_detail' => 'RT 0' . fake()->numberBetween(1, 5) . ' RW 0' . fake()->numberBetween(1, 3) . ', Desa ' . fake()->randomElement($desaMadukara) . ', Kec. Madukara',
            'latitude' => fake()->latitude(-7.40, -7.38), 
            'longitude' => fake()->longitude(109.68, 109.72),
            'deskripsi' => fake()->sentence(),
            'foto_jalan' => 'no-image.png', 
            'status' => fake()->randomElement($status),
            'total_upvote' => fake()->numberBetween(0, 100),
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }

    /**
     * Fungsi bantuan untuk generate nomor laporan unik saat seeding
     */
    private function generateNomorLaporan($prefix)
    {
        // Cari nomor terakhir yang diawali dengan YYMMDD tersebut di database
        $lastReport = Report::where('nomor_laporan', 'like', $prefix . '%')
                            ->orderBy('nomor_laporan', 'desc')
                            ->first();

        if ($lastReport) {
            $lastSequence = (int) substr($lastReport->nomor_laporan, -2);
            $sequence = str_pad($lastSequence + 1, 2, '0', STR_PAD_LEFT);
        } else {
            $sequence = '01';
        }

        return $prefix . $sequence;
    }
}