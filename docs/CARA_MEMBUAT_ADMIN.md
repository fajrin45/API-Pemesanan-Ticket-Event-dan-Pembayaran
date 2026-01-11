# Cara Membuat Admin User

Ada beberapa cara untuk membuat user dengan role admin:

## Metode 1: Menggunakan Seeder (Recommended)

Jalankan seeder yang sudah disediakan:

```bash
php artisan db:seed --class=AdminSeeder
```

Atau jalankan semua seeder:

```bash
php artisan db:seed
```

Seeder akan membuat:
- **Admin**: admin@example.com / password123
- **User**: fajrin@example.com / password123

## Metode 2: Menggunakan Tinker (Manual)

Jalankan Laravel Tinker:

```bash
php artisan tinker
```

Kemudian jalankan perintah berikut:

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Buat admin baru
$admin = User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('password123'),
    'role' => 'admin'
]);

// Atau update user yang sudah ada menjadi admin
$user = User::where('email', 'fajrin@example.com')->first();
$user->update(['role' => 'admin']);
```

## Metode 3: Menggunakan SQL Langsung

Jalankan query SQL langsung di database:

```sql
-- Buat admin baru
INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES ('Admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW());

-- Atau update user yang sudah ada menjadi admin
UPDATE users SET role = 'admin' WHERE email = 'fajrin@example.com';
```

**Catatan**: Password di atas adalah hash untuk "password123". Untuk password lain, gunakan bcrypt atau Hash::make().

## Metode 4: Menggunakan Postman/API (Update Role)

Jika sudah login sebagai user, Anda bisa update role melalui database langsung (tidak ada endpoint untuk ini karena alasan keamanan).

## Verifikasi Admin

Setelah membuat admin, verifikasi dengan:

1. **Login sebagai admin** di Postman atau UI:
   ```
   POST /api/login
   {
     "email": "admin@example.com",
     "password": "password123"
   }
   ```

2. **Cek profile** untuk melihat role:
   ```
   GET /api/auth/profile
   Authorization: Bearer {token}
   ```

3. **Test endpoint admin**:
   ```
   GET /api/admin/dashboard
   Authorization: Bearer {token}
   ```

Jika berhasil, response akan menampilkan:
```json
{
  "success": true,
  "message": "Selamat datang Admin"
}
```

## Troubleshooting

### Error: "Akses ditolak. Hanya admin yang dapat mengakses"
- Pastikan user memiliki `role = 'admin'` di database
- Pastikan sudah login dan menggunakan token yang benar
- Cek di database: `SELECT id, name, email, role FROM users WHERE email = 'admin@example.com';`

### Error: "Unauthenticated"
- Pastikan token masih valid
- Coba login ulang untuk mendapatkan token baru
- Pastikan header Authorization menggunakan format: `Bearer {token}`

### User tidak memiliki role
- Pastikan migration `add_role_to_users_table` sudah dijalankan
- Jika user dibuat sebelum migration, update manual:
  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
  ```

## Catatan Keamanan

⚠️ **PENTING**: 
- Jangan membuat endpoint public untuk membuat admin (keamanan)
- Gunakan seeder atau akses database langsung untuk membuat admin
- Simpan kredensial admin dengan aman
- Jangan commit password admin ke repository
