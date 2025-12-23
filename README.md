# SIPEKA

Sistem Informasi Pelaporan Kerusakan (SIPEKA) adalah aplikasi web berbasis Laravel yang memungkinkan pengguna untuk melaporkan kerusakan atau masalah publik, memberikan upvote pada laporan, dan memungkinkan admin untuk mengelola status laporan. Aplikasi ini menggunakan Inertia.js untuk pengalaman SPA (Single Page Application) dengan React di frontend dan Tailwind CSS untuk styling.

## Fitur Utama

- **Pelaporan Kerusakan**: Pengguna dapat membuat laporan kerusakan dengan detail lokasi dan deskripsi.
- **Upvote Laporan**: Pengguna dapat memberikan upvote pada laporan yang mereka dukung.
- **Peta Interaktif**: Tampilan peta untuk melihat lokasi laporan.
- **Dashboard Admin**: Admin dan Kadis dapat melihat semua laporan dan mengupdate statusnya.
- **Autentikasi**: Sistem login dan registrasi dengan role-based access (user, admin, kadis).
- **Responsive Design**: Menggunakan Tailwind CSS untuk tampilan yang responsif.

## Prerequisites

Sebelum menjalankan aplikasi ini, pastikan Anda memiliki:

- PHP >= 8.1
- Composer
- Node.js >= 16
- NPM atau Yarn
- Database (MySQL, PostgreSQL, atau SQLite)

## Instalasi

1. **Clone Repository**:
   ```bash
   git clone https://github.com/username/sipeka.git
   cd sipeka
   ```

2. **Install Dependencies PHP**:
   ```bash
   composer install
   ```

3. **Install Dependencies JavaScript**:
   ```bash
   npm install
   # atau
   yarn install
   ```

4. **Konfigurasi Environment**:
   - Salin file `.env.example` ke `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` untuk mengatur database dan konfigurasi lainnya.

5. **Generate Application Key**:
   ```bash
   php artisan key:generate
   ```

6. **Jalankan Migration dan Seeder**:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Build Assets**:
   ```bash
   npm run build
   # atau untuk development
   npm run dev
   ```

## Penggunaan

1. **Menjalankan Server**:
   ```bash
   php artisan serve
   ```

2. **Akses Aplikasi**:
   - Buka browser dan kunjungi `http://localhost:8000`
   - Registrasi akun baru atau login
   - Buat laporan di halaman `/laporan/buat`
   - Lihat laporan di beranda `/beranda`
   - Admin dapat mengakses dashboard di `/admin/dashboard`

## Struktur Proyek

- `app/Http/Controllers/`: Controller untuk menangani request
- `app/Models/`: Model Eloquent (User, Report, Upvote)
- `resources/js/`: Komponen React dan JavaScript
- `routes/web.php`: Definisi route
- `database/migrations/`: Migration database
- `database/seeders/`: Seeder untuk data awal

## Testing

Jalankan test dengan:
```bash
php artisan test
```

## Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Proyek ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

## Kontak

Jika ada pertanyaan, silakan hubungi [prazzid31@gmail.com] atau buat issue di repository ini.
