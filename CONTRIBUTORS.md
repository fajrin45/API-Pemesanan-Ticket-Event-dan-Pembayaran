# Kontribusi Anggota Kelompok

## Pembagian Tugas

### Ketua: Fajrin (2301010194)
**Tugas:**
- Desain arsitektur API
- Autentikasi JWT & middleware
- Integrasi pembayaran
- **Membuat UI Frontend (Single Page Application)**
- **Penyesuaian code dan integrasi sistem**

**File yang dikerjakan:**
- `app/Http/Controllers/AuthController.php` - Autentikasi JWT (register, login, logout, refresh)
- `app/Http/Middleware/IsAdmin.php` - Middleware untuk admin
- `app/Http/Controllers/PaymentController.php` - Integrasi pembayaran
- `app/Models/User.php` - Model User dengan JWT
- `config/jwt.php` - Konfigurasi JWT
- `routes/api.php` - Struktur routing API (arsitektur)
- `routes/web.php` - Routing untuk SPA frontend
- `app/Http/Kernel.php` - Registrasi middleware
- `app/Exceptions/Handler.php` - Custom exception handler untuk API
- `app/Http/Middleware/Authenticate.php` - Middleware autentikasi dengan JSON response
- **`public/index.html`** - Struktur HTML untuk Single Page Application
- **`public/app.js`** - JavaScript untuk frontend (routing, API calls, state management)
- **`public/styles.css`** - Styling untuk UI
- `database/seeders/AdminSeeder.php` - Seeder untuk membuat admin user
- `docs/CARA_MEMBUAT_ADMIN.md` - Dokumentasi cara membuat admin
- Penyesuaian dan perbaikan code di berbagai controller dan middleware

---

### Anggota 1: Riska shari septiani (2301010209)
**Tugas:**
- Desain database & relasi tabel
- Endpoint Event & Tiket
- Validasi data

**File yang dikerjakan:**
- `database/migrations/2026_01_09_140932_create_events_table.php` - Migration Event
- `database/migrations/2026_01_10_154757_create_tikets_table.php` - Migration Tiket
- `database/migrations/2026_01_10_154845_remove_harga_tiket_kuota_from_events_table.php` - Refactor Event
- `database/migrations/2026_01_10_154946_add_role_to_users_table.php` - Migration Role
- `app/Models/Event.php` - Model Event dengan relasi
- `app/Models/Tiket.php` - Model Tiket dengan relasi
- `app/Http/Controllers/Api/EventController.php` - CRUD Event dengan validasi
- `app/Http/Controllers/Api/TiketController.php` - CRUD Tiket dengan validasi
- Relasi model di semua Model (Event, Tiket, User, Order, Payment)

---

### Anggota 2: M. syahidding danuwarsi abdussamad (2301010187)
**Tugas:**
- Endpoint Pemesanan & Pembayaran
- Log aktivitas
- Dokumentasi API & testing

**File yang dikerjakan:**
- `database/migrations/2026_01_10_154805_create_orders_table.php` - Migration Order
- `app/Models/Order.php` - Model Order dengan relasi
- `app/Http/Controllers/Api/OrderController.php` - CRUD Pemesanan
- `app/Http/Controllers/Api/ActivityLogController.php` - Endpoint Log Aktivitas
- `app/Models/ActivityLog.php` - Model ActivityLog
- `database/migrations/2026_01_09_063506_create_activity_logs_table.php` - Migration ActivityLog
- `docs/API_DOCUMENTATION.md` - Dokumentasi lengkap API
- `docs/postman/README.md` - Panduan Postman Collection
- `README.md` - Dokumentasi proyek

---

## Catatan Commit

Setiap commit harus mencantumkan:
- Nama anggota yang mengerjakan
- Deskripsi singkat perubahan
- File yang diubah/ditambahkan

**Format commit message:**
```
[Nama Anggota] Deskripsi singkat perubahan

Detail perubahan:
- File yang diubah
- Fitur yang ditambahkan
```

**Contoh:**
```
[Riska] Implementasi CRUD Event dan Tiket dengan validasi

- Membuat migration events dan tikets
- Membuat EventController dan TiketController
- Menambahkan validasi data di semua endpoint
- Menambahkan relasi model Event dan Tiket
```

**Contoh untuk UI:**
```
[Fajrin] Implementasi UI Frontend dan penyesuaian code

- Membuat Single Page Application (SPA) dengan HTML, CSS, JavaScript
- Implementasi routing client-side
- Integrasi frontend dengan API backend
- Menambahkan fitur admin untuk membuat event dan tiket
- Perbaikan error handling dan validasi di frontend
- Penyesuaian middleware dan exception handler
```

---

## Catatan Tambahan

### Frontend UI
- **Dibuat oleh**: Fajrin (Ketua)
- **Teknologi**: HTML5, CSS3, Vanilla JavaScript (SPA)
- **Fitur**: Login/Register, Event listing, Order management, Payment processing, Profile, Admin panel
- **File utama**: `public/index.html`, `public/app.js`, `public/styles.css`

### Penyesuaian Code
- **Dilakukan oleh**: Fajrin (Ketua)
- **Fokus**: Integrasi frontend-backend, error handling, middleware, exception handling, route configuration
