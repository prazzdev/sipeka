# SIPEKA

Sistem Informasi Pelaporan Kerusakan (SIPEKA) adalah aplikasi web berbasis Laravel yang memungkinkan pengguna untuk melaporkan kerusakan atau masalah publik, memberikan upvote pada laporan, memberikan komentar, dan memungkinkan admin untuk mengelola status laporan serta mengekspor data. Aplikasi ini menggunakan Inertia.js untuk pengalaman SPA (Single Page Application) dengan React di frontend dan Tailwind CSS untuk styling.

## Fitur Utama

- **Pelaporan Kerusakan**: Pengguna dapat membuat laporan kerusakan dengan detail lokasi dan deskripsi.
- **Upvote Laporan**: Pengguna dapat memberikan upvote pada laporan yang mereka dukung.
- **Komentar pada Laporan**: Pengguna dapat memberikan komentar pada laporan untuk diskusi lebih lanjut.
- **Peta Interaktif**: Tampilan peta menggunakan Leaflet untuk melihat lokasi laporan.
- **Dashboard Admin**: Admin dan Kadis dapat melihat semua laporan, mengupdate statusnya, dan mengelola komentar.
- **Export Laporan**: Admin dapat mengekspor laporan ke format PDF menggunakan DomPDF.
- **Autentikasi**: Sistem login dan registrasi dengan role-based access (user, admin, kadis).
- **Responsive Design**: Menggunakan Tailwind CSS untuk tampilan yang responsif.

## Prerequisites

Sebelum menjalankan aplikasi ini, pastikan Anda memiliki:

- PHP >= 8.2
- Composer
- Node.js >= 16
- NPM atau Yarn
- Database (MySQL, PostgreSQL, atau SQLite)

## Instalasi

1. **Clone Repository**:
   ```bash
   git clone https://github.com/prazzdev/sipeka.git
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
   - Berikan upvote atau komentar pada laporan
   - Lihat peta laporan di `/peta`
   - Admin dapat mengakses dashboard di `/admin/dashboard` dan mengekspor laporan

## Struktur Proyek

- `app/Http/Controllers/`: Controller untuk menangani request (ReportController, CommentController, UpvoteController, dll.)
- `app/Models/`: Model Eloquent (User, Report, Upvote, Comment, ReportLog)
- `resources/js/`: Komponen React dan JavaScript menggunakan Inertia.js
- `routes/web.php`: Definisi route
- `database/migrations/`: Migration database
- `database/seeders/`: Seeder untuk data awal
- `public/`: File statis dan build assets

## Dependencies Utama

### PHP
- Laravel Framework ^11.0
- Inertia.js ^2.0
- DomPDF ^3.1 (untuk export PDF)
- Ziggy ^2.0 (untuk routing JavaScript)

### JavaScript
- React ^18.2.0
- Inertia.js React ^2.0
- Tailwind CSS ^3.2.1
- Leaflet ^1.9.4 (untuk peta interaktif)
- SweetAlert2 ^11.26.17 (untuk alert)

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
