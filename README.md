# API Pemesanan Tiket Event dan Pembayaran

**Dibuat oleh:** fajrin (Ketua)  
**Mata Kuliah:** Pemrograman Web Service  
**Tahun:** 2026

## Judul Proyek

**API Pemesanan Tiket Event dan Pembayaran** merupakan layanan Web Service berbasis REST yang digunakan untuk mengelola data event, tiket, pemesanan, serta proses pembayaran secara online. Sistem ini menyediakan endpoint autentikasi pengguna menggunakan JWT, manajemen event dan tiket, pemesanan tiket, pencatatan pembayaran, serta log aktivitas.

Sistem ini dilengkapi dengan **Frontend UI** modern yang terintegrasi langsung dengan API backend, memungkinkan pengguna untuk melakukan semua operasi melalui antarmuka web yang user-friendly.

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

4. **Generate JWT Secret** (Jika belum)
   ```bash
   php artisan jwt:secret
   ```

5. **Jalankan Migration**
   ```bash
   php artisan migrate
   ```

6. **Buat Admin User** (Penting!)
   ```bash
   php artisan db:seed --class=AdminSeeder
   ```
   
   Atau jalankan semua seeder:
   ```bash
   php artisan db:seed
   ```

7. **Jalankan Server**
   ```bash
   php artisan serve
   ```
   
   Server akan berjalan di `http://localhost:8000`

8. **Akses Aplikasi**
   - **Frontend UI**: `http://localhost:8000` (Aplikasi web dengan antarmuka pengguna)
   - **Base URL API**: `http://localhost:8000/api`

## Struktur Database

Sistem menggunakan database MySQL dengan struktur sebagai berikut:

### Tabel Utama
- **users**: Data pengguna dengan autentikasi JWT dan role (user/admin)
- **events**: Data event dengan soft delete
- **tikets**: Data tiket dengan relasi ke event (harga, kuota, terjual)
- **orders**: Data pemesanan tiket dengan status (pending/confirmed/cancelled)
- **payments**: Data pembayaran dengan status (pending/sukses/gagal)
- **activity_logs**: Log aktivitas pengguna untuk audit trail

### Relasi Database
- Events → Tikets (One to Many)
- Tikets → Orders (One to Many)
- Users → Orders (One to Many)
- Orders → Payments (One to One)
- Users → Payments (One to Many)

Detail lengkap struktur database dapat dilihat di `docs/API_DOCUMENTATION.md` bagian "Struktur Database".

## Informasi Akun Uji Coba

Untuk keperluan pengujian, Anda dapat menggunakan akun berikut atau membuat akun baru melalui endpoint register atau UI:

### Akun Admin
- **Email**: admin@example.com
- **Password**: password123
- **Role**: admin

### Akun User
- **Email**: fajrin@example.com
- **Password**: password123
- **Role**: user

## Cara Membuat Admin User

**PENTING**: User yang didaftarkan melalui `/api/register` secara default memiliki role `user`. Untuk membuat admin, gunakan salah satu metode berikut:

### Metode 1: Menggunakan Seeder (Paling Mudah)

Jalankan seeder untuk membuat admin:

```bash
php artisan db:seed --class=AdminSeeder
```

Atau jalankan semua seeder:

```bash
php artisan db:seed
```

Seeder akan membuat:
- Admin: admin@example.com / password123
- User: fajrin@example.com / password123

### Metode 2: Menggunakan Tinker

```bash
php artisan tinker
```

Kemudian jalankan:

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Buat admin baru
User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('password123'),
    'role' => 'admin'
]);

// Atau update user yang sudah ada menjadi admin
$user = User::where('email', 'fajrin@example.com')->first();
$user->update(['role' => 'admin']);
```

### Metode 3: Menggunakan SQL Langsung

```sql
-- Update user menjadi admin
UPDATE users SET role = 'admin' WHERE email = 'fajrin@example.com';

-- Atau buat admin baru
INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES ('Admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW());
```

**Catatan**: Password hash di atas adalah untuk "password123". Untuk password lain, gunakan `bcrypt()` atau `Hash::make()`.

### Verifikasi Admin

Setelah membuat admin, test dengan:

1. **Login sebagai admin**:
   ```
   POST /api/login
   {
     "email": "admin@example.com",
     "password": "password123"
   }
   ```

2. **Test endpoint admin**:
   ```
   GET /api/admin/dashboard
   Authorization: Bearer {token}
   ```

3. **Di UI**: Setelah login sebagai admin, tombol "Buat Event" akan muncul di halaman Events.

**Detail lengkap**: Lihat `docs/CARA_MEMBUAT_ADMIN.md` untuk panduan lengkap dan troubleshooting.

## Dokumentasi Lengkap

Dokumentasi lengkap sistem dapat diakses melalui:

### 📚 Dokumentasi API
- **`docs/API_DOCUMENTATION.md`** - Dokumentasi lengkap semua endpoint API dengan contoh request/response
  - Struktur database lengkap
  - Semua endpoint dengan detail
  - Error handling dan status codes
  - Contoh data menggunakan nama "fajrin"

### 🧪 Panduan Testing Postman
- **`docs/PANDUAN_POSTMAN_LENGKAP.md`** - Panduan lengkap testing semua endpoint di Postman
  - Setup environment dan collection
  - 27+ test cases lengkap dengan langkah detail
  - Troubleshooting guide
  - Checklist testing

- **`docs/POSTMAN_TESTING_GUIDE.md`** - Panduan cepat testing di Postman
  - Quick reference untuk semua endpoint
  - Contoh request dan response
  - Tips dan best practices

### 📋 Postman Collection
- **`docs/postman/`** - Folder berisi file collection dan environment untuk Postman

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
- `GET /api/payments` - Mendapatkan daftar pembayaran user
- `GET /api/payments/{id}` - Mendapatkan detail pembayaran
- `POST /api/payments` - Membuat pembayaran
- `PUT /api/payments/{id}/status` - Update status pembayaran

#### Log Aktivitas
- `GET /api/activity-logs` - Mendapatkan log aktivitas
- `GET /api/activity-logs/{id}` - Mendapatkan detail log aktivitas

## Frontend UI

Aplikasi ini dilengkapi dengan **antarmuka pengguna (UI) modern** yang dapat diakses melalui browser di `http://localhost:8000`. UI terintegrasi langsung dengan API backend dan menyediakan pengalaman pengguna yang lengkap.

### Fitur-fitur UI

#### Halaman Publik (Tanpa Login)
- **Beranda**: Hero section dengan informasi sistem dan fitur-fitur utama
- **Daftar Event**: Menampilkan semua event dengan fitur pencarian dan filter lokasi
- **Detail Event**: Menampilkan detail lengkap event beserta tiket yang tersedia

#### Halaman Terproteksi (Butuh Login)
- **Autentikasi**: 
  - Halaman login dengan validasi
  - Halaman registrasi dengan validasi
  - Auto-redirect setelah login/logout
  
- **Manajemen Event** (Admin):
  - Buat event baru (modal form)
  - Edit event yang sudah ada
  - Hapus event (soft delete)
  
- **Manajemen Tiket** (Admin):
  - Tambah tiket untuk event (modal form)
  - Edit tiket
  - Hapus tiket
  
- **Pemesanan**:
  - Pesan tiket langsung dari detail event
  - Modal pemesanan dengan kalkulasi otomatis total harga
  - Validasi kuota tiket real-time
  - Riwayat pemesanan dengan filter status
  - Detail pesanan lengkap dengan informasi event dan tiket
  - Batalkan pesanan (jika status pending)
  
- **Pembayaran**:
  - Modal pembayaran otomatis muncul setelah membuat pesanan
  - Pilih metode pembayaran (Bank Transfer, E-Wallet, Credit Card)
  - Validasi amount harus sama dengan total harga order
  - Riwayat pembayaran dengan filter status
  - Detail pembayaran lengkap dengan informasi order
  
- **Profil**:
  - Informasi profil user
  - Logout

### Teknologi UI
- **HTML5, CSS3, JavaScript (Vanilla JS)** - Tanpa framework, performa optimal
- **Responsive Design** - Mobile-friendly, tampil sempurna di semua device
- **Modern UI/UX** - Desain menarik dengan animasi dan transisi halus
- **Sistem Notifikasi** - Toast notifications untuk feedback user
- **Error Handling** - Penanganan error yang user-friendly
- **Auto Authentication** - Token management otomatis

### File UI
- `public/index.html` - Struktur HTML utama dengan routing SPA
- `public/styles.css` - Styling lengkap dengan CSS modern
- `public/app.js` - JavaScript untuk API integration dan routing

## Teknologi yang Digunakan

### Backend
- **Framework**: Laravel 10
- **PHP**: >= 8.1
- **Database**: MySQL
- **Autentikasi**: JWT (tymon/jwt-auth)
- **ORM**: Eloquent ORM
- **Migration**: Database migrations dengan soft delete support

### Frontend
- **HTML5**: Struktur semantic
- **CSS3**: Modern styling dengan CSS variables, flexbox, grid
- **JavaScript**: Vanilla JS (ES6+) tanpa framework
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter)

### Tools & Libraries
- **Composer**: Dependency management
- **JWT Auth**: tymon/jwt-auth untuk autentikasi
- **Postman**: API testing dan dokumentasi
- **Git**: Version control

### Format Data
- **Request/Response**: JSON
- **API Style**: RESTful API
- **Status Codes**: Standard HTTP status codes

## Fitur Utama Sistem

### ✅ Autentikasi & Authorization
- Register dan Login dengan JWT
- Role-based access control (User & Admin)
- Token refresh mechanism
- Auto-logout saat token expired

### ✅ Manajemen Event
- CRUD lengkap untuk event
- Soft delete untuk event
- Filter berdasarkan lokasi
- Sort berdasarkan tanggal
- Public endpoint untuk melihat event (tanpa login)

### ✅ Manajemen Tiket
- CRUD lengkap untuk tiket
- Multiple jenis tiket per event (VIP, Regular, dll)
- Tracking kuota dan tiket terjual
- Public endpoint untuk melihat tiket (tanpa login)

### ✅ Pemesanan Tiket
- Validasi kuota real-time
- Kalkulasi total harga otomatis
- Status tracking (pending, confirmed, cancelled)
- Auto-update kuota saat pesanan dibuat/dibatalkan
- Riwayat pemesanan dengan filter

### ✅ Pembayaran
- Integrasi dengan order
- Validasi amount harus sama dengan total harga
- Multiple payment methods
- Status tracking (pending, sukses, gagal)
- Auto-update order status saat pembayaran sukses
- Riwayat pembayaran lengkap

### ✅ Activity Logging
- Log semua aktivitas penting
- User login/logout tracking
- Transaction logging
- Admin dapat melihat semua logs
- User hanya melihat log sendiri

### ✅ Error Handling
- Custom exception handler untuk API
- Konsisten error response format
- Validation error dengan detail field
- User-friendly error messages

### ✅ Security
- JWT authentication
- Password hashing (bcrypt)
- CORS configuration
- Input validation
- SQL injection protection (Eloquent ORM)
- XSS protection

## Struktur Project

```
api-pemesanan-tiket-event/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── EventController.php
│   │   │   │   ├── TiketController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   └── ActivityLogController.php
│   │   │   ├── AuthController.php
│   │   │   └── PaymentController.php
│   │   └── Middleware/
│   │       ├── Authenticate.php
│   │       └── IsAdmin.php
│   └── Models/
│       ├── User.php
│       ├── Event.php
│       ├── Tiket.php
│       ├── Order.php
│       ├── Payment.php
│       └── ActivityLog.php
├── database/
│   ├── migrations/
│   └── seeders/
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── PANDUAN_POSTMAN_LENGKAP.md
│   ├── POSTMAN_TESTING_GUIDE.md
│   └── postman/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── routes/
│   ├── api.php
│   └── web.php
├── CHANGELOG.md
├── CONTRIBUTORS.md
└── README.md
```

## Quick Start Guide

### 1. Setup Database
```bash
# Buat database MySQL
CREATE DATABASE event_ticket_db;

# Update .env dengan kredensial database
DB_DATABASE=event_ticket_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 2. Install & Run
```bash
# Install dependencies
composer install

# Generate app key
php artisan key:generate

# Generate JWT secret (PENTING untuk autentikasi)
php artisan jwt:secret

# Run migrations
php artisan migrate

# Buat admin user (PENTING!)
php artisan db:seed --class=AdminSeeder

# (Optional) Seed event sample
php artisan db:seed

# Start server
php artisan serve
```

**⚠️ PENTING**: 
- Pastikan sudah menjalankan `php artisan jwt:secret` sebelum testing
- Pastikan sudah menjalankan `AdminSeeder` untuk membuat admin user
- Tanpa admin user, Anda tidak bisa mengakses endpoint admin dan fitur admin di UI

### 3. Akses Aplikasi
- **Frontend UI**: http://localhost:8000
- **API Base URL**: http://localhost:8000/api
- **API Docs**: Lihat `docs/API_DOCUMENTATION.md`

### 4. Testing
- **Postman**: Ikuti panduan di `docs/PANDUAN_POSTMAN_LENGKAP.md`
- **UI**: Login di http://localhost:8000 dan coba semua fitur

## Endpoint Summary

| Kategori | Method | Endpoint | Auth | Public |
|----------|--------|----------|------|--------|
| **Auth** | POST | `/api/register` | ❌ | ✅ |
| | POST | `/api/login` | ❌ | ✅ |
| | GET | `/api/auth/profile` | ✅ | ❌ |
| | POST | `/api/auth/logout` | ✅ | ❌ |
| | POST | `/api/auth/refresh` | ✅ | ❌ |
| **Events** | GET | `/api/events` | ❌ | ✅ |
| | GET | `/api/events/{id}` | ❌ | ✅ |
| | POST | `/api/events` | ✅ | ❌ |
| | PUT | `/api/events/{id}` | ✅ | ❌ |
| | DELETE | `/api/events/{id}` | ✅ | ❌ |
| **Tikets** | GET | `/api/tikets` | ❌ | ✅ |
| | GET | `/api/tikets/{id}` | ❌ | ✅ |
| | POST | `/api/tikets` | ✅ | ❌ |
| | PUT | `/api/tikets/{id}` | ✅ | ❌ |
| | DELETE | `/api/tikets/{id}` | ✅ | ❌ |
| **Orders** | GET | `/api/orders` | ✅ | ❌ |
| | POST | `/api/orders` | ✅ | ❌ |
| | GET | `/api/orders/{id}` | ✅ | ❌ |
| | PUT | `/api/orders/{id}` | ✅ | ❌ |
| | DELETE | `/api/orders/{id}` | ✅ | ❌ |
| **Payments** | GET | `/api/payments` | ✅ | ❌ |
| | GET | `/api/payments/{id}` | ✅ | ❌ |
| | POST | `/api/payments` | ✅ | ❌ |
| | PUT | `/api/payments/{id}/status` | ✅ | ❌ |
| **Activity Logs** | GET | `/api/activity-logs` | ✅ | ❌ |
| | GET | `/api/activity-logs/{id}` | ✅ | ❌ |
| **Admin** | GET | `/api/admin/dashboard` | ✅ + Admin | ❌ |

**Total: 27 Endpoints**

## Anggota Kelompok

- **Ketua**: Fajrin (2301010194)
  - Desain arsitektur API
  - Autentikasi JWT & middleware
  - Integrasi pembayaran
  - Frontend UI development

- **Anggota 1**: Riska shari septiani (2301010209)
  - Desain database & relasi tabel
  - Endpoint Event & Tiket
  - Validasi data

- **Anggota 2**: M. syahidding danuwarsi abdussamad (2301010187)
  - Endpoint Pemesanan & Pembayaran
  - Log aktivitas
  - Dokumentasi API & testing

Detail kontribusi lengkap dapat dilihat di `CONTRIBUTORS.md`.

## Changelog

Perubahan dan update sistem dapat dilihat di `CHANGELOG.md` yang mencakup:
- Perbaikan endpoint dan error handling
- Penambahan fitur baru
- Update dokumentasi
- Perbaikan UI

## Lisensi

Proyek ini dibuat untuk keperluan **Ujian Akhir Semester (UAS) Mata Kuliah Pemrograman Web Service**.

---

**Dibuat dengan ❤️ oleh fajrin dan tim**
