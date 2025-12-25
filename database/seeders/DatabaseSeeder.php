<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat 1 Admin tetap untuk login
        \App\Models\User::create(
            [
                'name' => 'Admin SIPEKA',
                'email' => 'admin@sipeka.com',
                'password' => bcrypt('password'), 
                'role' => 'admin',
            ],
            [
                'name' => 'Kepala Dinas PUPR',
                'email' => 'kadis@sipeka.com',
                'password' => bcrypt('password'), 
                'role' => 'kadis',
            ],
            [
                'name' => 'Bambang Madukara',
                'email' => 'user@sipeka.com',
                'password' => bcrypt('password'), 
                'role' => 'user',
            ]
        );

        // 2. Buat 40 Pengguna Biasa
        \App\Models\User::factory(40)->create();

        // 3. Buat 30 Laporan
        \App\Models\Report::factory(30)->create()->each(function ($report) {
            // 4. Untuk setiap laporan, buatkan 1-3 komentar histori secara acak
            $admin = \App\Models\User::where('role', 'admin')->first();
            
            // Hanya buat komentar jika status bukan 'menunggu'
            if ($report->status !== 'menunggu') {
                \App\Models\Comment::create([
                    'report_id' => $report->id,
                    'user_id' => $admin->id,
                    'pesan' => 'Laporan telah diperiksa dan saat ini berstatus ' . $report->status,
                    'status' => $report->status,
                    'created_at' => $report->created_at->addDays(2),
                ]);
            }
        });
    }
}
