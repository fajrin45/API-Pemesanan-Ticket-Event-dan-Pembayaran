# API Pemesanan Tiket Event dan Pembayaran

## Judul Proyek

**API Pemesanan Tiket Event dan Pembayaran** merupakan layanan Web Service berbasis REST yang digunakan untuk mengelola data event, tiket, pemesanan, serta proses pembayaran secara online. Sistem ini menyediakan endpoint autentikasi pengguna menggunakan JWT, manajemen event dan tiket, pemesanan tiket, pencatatan pembayaran, serta log aktivitas.

## Deskripsi Singkat

API Pemesanan Tiket Event dan Pembayaran adalah sistem Web Service yang dikembangkan menggunakan Laravel Framework untuk menyediakan layanan pemesanan tiket event secara online. API ini menyediakan berbagai endpoint RESTful yang memungkinkan pengguna untuk:

- **Autentikasi**: Register dan login menggunakan JWT (JSON Web Token)
- **Manajemen Event**: CRUD data event (membuat, membaca, memperbarui, menghapus event)
- **Manajemen Tiket**: CRUD tiket event dengan berbagai jenis dan harga
- **Pemesanan Tiket**: Membuat pesanan tiket dan melihat riwayat pemesanan
- **Pembayaran**: Pencatatan pembayaran dan update status pembayaran (pending, sukses, gagal)
- **Log Aktivitas**: Pencatatan aktivitas penting seperti login dan transaksi

API dikembangkan menggunakan standar RESTful dengan response JSON sehingga mudah diintegrasikan dengan berbagai aplikasi frontend.

## Cara Menjalankan Sistem

### Prasyarat
- PHP >= 8.1
- Composer
- MySQL
- Git

### Langkah-langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/[username]/api-pemesanan-tiket-event.git
   cd api-pemesanan-tiket-event
   ```

2. **Install Dependencies menggunakan Composer**
   ```bash
   composer install
   ```

3. **Konfigurasi File .env**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   
   Edit file `.env` dan sesuaikan konfigurasi database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=nama_database_anda
   DB_USERNAME=username_database
   DB_PASSWORD=password_database
   
   JWT_SECRET=your-jwt-secret-key
   ```

4. **Jalankan Migration**
   ```bash
   php artisan migrate
   ```

5. **Jalankan Server**
   ```bash
   php artisan serve
   ```
   
   Server akan berjalan di `http://localhost:8000`

6. **Akses API**
   Base URL API: `http://localhost:8000/api`

## Informasi Akun Uji Coba

Untuk keperluan pengujian, Anda dapat menggunakan akun berikut atau membuat akun baru melalui endpoint register:

### Akun Admin
- **Email**: admin@example.com
- **Password**: password123
- **Role**: admin

### Akun User
- **Email**: user@example.com
- **Password**: password123
- **Role**: user

**Catatan**: Jika akun di atas belum tersedia, silakan buat akun baru melalui endpoint `/api/register` atau jalankan seeder:
```bash
php artisan db:seed
```

## Dokumentasi API

Dokumentasi lengkap API dapat diakses melalui:

- **Postman Collection**: Lihat folder `docs/postman/` untuk file collection dan environment
- **Dokumentasi Endpoint**: Lihat file `docs/API_DOCUMENTATION.md` untuk detail lengkap semua endpoint

### Endpoint Utama

#### Autentikasi
- `POST /api/register` - Register pengguna baru
- `POST /api/login` - Login dan mendapatkan JWT token
- `GET /api/auth/profile` - Mendapatkan profil user yang sedang login
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

#### Event
- `GET /api/events` - Mendapatkan daftar event
- `POST /api/events` - Membuat event baru
- `GET /api/events/{id}` - Mendapatkan detail event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Hapus event

#### Tiket
- `GET /api/tikets` - Mendapatkan daftar tiket
- `POST /api/tikets` - Membuat tiket baru
- `GET /api/tikets/{id}` - Mendapatkan detail tiket
- `PUT /api/tikets/{id}` - Update tiket
- `DELETE /api/tikets/{id}` - Hapus tiket

#### Pemesanan
- `GET /api/orders` - Mendapatkan riwayat pemesanan user
- `POST /api/orders` - Membuat pesanan tiket baru
- `GET /api/orders/{id}` - Mendapatkan detail pesanan
- `PUT /api/orders/{id}` - Update pesanan
- `DELETE /api/orders/{id}` - Hapus pesanan

#### Pembayaran
- `POST /api/payments` - Membuat pembayaran
- `PUT /api/payments/{id}/status` - Update status pembayaran

#### Log Aktivitas
- `GET /api/activity-logs` - Mendapatkan log aktivitas
- `GET /api/activity-logs/{id}` - Mendapatkan detail log aktivitas

## Teknologi yang Digunakan

- **Backend**: PHP (Laravel 10)
- **Database**: MySQL
- **Autentikasi**: JWT (tymon/jwt-auth)
- **Format Data**: JSON
- **API Testing**: Postman
- **Version Control**: GitHub

## Anggota Kelompok

- **Ketua**: Fajrin (2301010194)
- **Anggota 1**: Riska shari septiani (2301010209)
- **Anggota 2**: M. syahidding danuwarsi abdussamad (2301010187)

## Lisensi

Proyek ini dibuat untuk keperluan Ujian Akhir Semester (UAS) Mata Kuliah Pemrograman Web Service.
