# Postman Collection - API Pemesanan Tiket Event dan Pembayaran

## Cara Menggunakan

1. **Import Collection**
   - Buka Postman
   - Klik Import
   - Pilih file `API_Pemesanan_Tiket_Event.postman_collection.json`
   - Klik Import

2. **Import Environment (Opsional)**
   - Klik Import
   - Pilih file `API_Environment.postman_environment.json`
   - Klik Import
   - Pilih environment "API Pemesanan Tiket Event" di dropdown kanan atas

3. **Setup Environment Variables**
   Jika menggunakan environment, pastikan variabel berikut sudah diatur:
   - `base_url`: `http://localhost:8000/api`
   - `token`: (akan diisi otomatis setelah login)

4. **Menggunakan Collection**
   - Pastikan server Laravel sudah berjalan (`php artisan serve`)
   - Mulai dengan endpoint `Register` atau `Login` untuk mendapatkan token
   - Token akan otomatis tersimpan di environment variable `token` jika menggunakan environment
   - Gunakan token tersebut untuk mengakses endpoint yang memerlukan autentikasi

## Struktur Collection

Collection ini terorganisir dalam folder-folder berikut:

- **Authentication**: Register, Login, Profile, Logout, Refresh Token
- **Event**: CRUD operations untuk Event
- **Tiket**: CRUD operations untuk Tiket
- **Order**: CRUD operations untuk Pemesanan
- **Payment**: Create payment dan update status
- **Activity Log**: Get list dan detail log aktivitas

## Catatan

- Semua endpoint yang memerlukan autentikasi sudah dikonfigurasi untuk menggunakan token dari environment variable
- Pastikan untuk login terlebih dahulu sebelum mengakses endpoint yang memerlukan autentikasi
- Base URL dapat diubah melalui environment variable `base_url`
