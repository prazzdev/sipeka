<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('role', 'user')->first();

        $reports = [
            [
                'user_id' => $user->id,
                'judul_laporan' => 'Lubang Dalam di Pertigaan Madukara',
                'deskripsi' => 'Ada lubang cukup dalam, sangat berbahaya bagi pengendara motor di malam hari.',
                'foto_jalan' => 'laporan-jalan/dummy1.jpg', // Pastikan folder ada di storage
                'lokasi_detail' => 'Dekat Kantor Kecamatan Madukara',
                'latitude' => -7.3891, 
                'longitude' => 109.7185,
                'status' => 'menunggu',
                'total_upvote' => 15
            ],
            [
                'user_id' => $user->id,
                'judul_laporan' => 'Aspal Mengelupas di Desa Pagelak',
                'deskripsi' => 'Aspal sudah habis tinggal tanah dan bebatuan tajam.',
                'foto_jalan' => 'laporan-jalan/dummy2.jpg',
                'lokasi_detail' => 'Jalan utama Desa Pagelak',
                'latitude' => -7.3750, 
                'longitude' => 109.7250,
                'status' => 'diproses',
                'total_upvote' => 42
            ],
            [
                'user_id' => $user->id,
                'judul_laporan' => 'Longsor Bahu Jalan',
                'deskripsi' => 'Bahu jalan longsor setengah badan jalan, butuh penanganan segera sebelum ambrol total.',
                'foto_jalan' => 'laporan-jalan/dummy3.jpg',
                'lokasi_detail' => 'Arah menuju Pagentan lewat Madukara',
                'latitude' => -7.3600, 
                'longitude' => 109.7400,
                'status' => 'diverifikasi',
                'total_upvote' => 89
            ],
        ];

        foreach ($reports as $report) {
            Report::create($report);
        }
    }
}