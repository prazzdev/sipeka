<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin PUPR
        User::create([
            'name' => 'Admin SIPEKA',
            'email' => 'admin@sipeka.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Kepala Dinas
        User::create([
            'name' => 'Kepala Dinas PUPR',
            'email' => 'kadis@sipeka.com',
            'password' => Hash::make('password'),
            'role' => 'kadis',
        ]);

        // User Biasa (Warga)
        User::create([
            'name' => 'Bambang Madukara',
            'email' => 'user@sipeka.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
    }
}