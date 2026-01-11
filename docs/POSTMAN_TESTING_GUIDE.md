# Panduan Testing API di Postman

## Setup Awal

### 1. Setup Environment di Postman

1. Buat New Environment dengan nama "API Testing"
2. Tambahkan variables berikut:
   - `base_url` = `http://localhost:8000/api`
   - `token` = (kosongkan dulu, akan diisi setelah login)

### 2. Pastikan Server Laravel Berjalan

```bash
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

---

## Testing Endpoint (Tanpa Login)

### ✅ 1. GET List Events (PUBLIC - Tidak Perlu Auth)

**Request:**
```
GET {{base_url}}/events
```

**Headers:** (Tidak perlu Authorization)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data event berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [...],
    "per_page": 10,
    "total": 1
  }
}
```

**Query Parameters (Optional):**
- `lokasi` - Filter berdasarkan lokasi (contoh: `?lokasi=Jakarta`)
- `sort` - Sort berdasarkan tanggal (contoh: `?sort=asc` atau `?sort=desc`)

---

### ✅ 2. GET Detail Event (PUBLIC - Tidak Perlu Auth)

**Request:**
```
GET {{base_url}}/events/1
```

**Headers:** (Tidak perlu Authorization)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Detail event",
  "data": {
    "id": 1,
    "nama_event": "Konser Musik",
    "deskripsi": "...",
    "tanggal_event": "2026-02-15 19:00:00",
    "lokasi": "Jakarta",
    "tikets": [...]
  }
}
```

---

### ✅ 3. GET List Tikets (PUBLIC - Tidak Perlu Auth)

**Request:**
```
GET {{base_url}}/tikets
```

**Headers:** (Tidak perlu Authorization)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data tiket berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [...]
  }
}
```

**Query Parameters (Optional):**
- `event_id` - Filter berdasarkan event (contoh: `?event_id=1`)
- `jenis_tiket` - Filter berdasarkan jenis (contoh: `?jenis_tiket=VIP`)

---

### ✅ 4. GET Detail Tiket (PUBLIC - Tidak Perlu Auth)

**Request:**
```
GET {{base_url}}/tikets/1
```

**Headers:** (Tidak perlu Authorization)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Detail tiket",
  "data": {
    "id": 1,
    "event_id": 1,
    "jenis_tiket": "VIP",
    "harga": "500000.00",
    "kuota": 100,
    "terjual": 0,
    "event": {...}
  }
}
```

---

## Testing Endpoint (Dengan Login)

### 1. Register User Baru

**Request:**
```
POST {{base_url}}/register
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Register berhasil",
  "data": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

---

### 2. Login untuk Mendapatkan Token

**Request:**
```
POST {{base_url}}/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

**⚠️ IMPORTANT:** Copy token dari response dan paste ke environment variable `token` di Postman!

---

### 3. Set Authorization Header untuk Request yang Membutuhkan Auth

Untuk semua request yang membutuhkan authentication, tambahkan header:

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

### 4. GET Profile (Butuh Auth)

**Request:**
```
GET {{base_url}}/auth/profile
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

---

### 5. CREATE Event (Butuh Auth)

**Request:**
```
POST {{base_url}}/events
```

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "nama_event": "Konser Musik Rock",
  "deskripsi": "Konser musik rock terbaik",
  "tanggal_event": "2026-03-20 19:00:00",
  "lokasi": "Bandung"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Event berhasil dibuat",
  "data": {
    "id": 2,
    "nama_event": "Konser Musik Rock",
    ...
  }
}
```

---

### 6. UPDATE Event (Butuh Auth)

**Request:**
```
PUT {{base_url}}/events/1
```

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "nama_event": "Konser Musik Updated",
  "lokasi": "Surabaya"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Event berhasil diperbarui",
  "data": {...}
}
```

---

### 7. DELETE Event (Butuh Auth)

**Request:**
```
DELETE {{base_url}}/events/1
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Event berhasil dihapus (soft delete)"
}
```

---

### 8. CREATE Tiket (Butuh Auth)

**Request:**
```
POST {{base_url}}/tikets
```

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "event_id": 1,
  "jenis_tiket": "VIP",
  "harga": 500000,
  "kuota": 100
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Tiket berhasil dibuat",
  "data": {...}
}
```

---

### 9. CREATE Order (Butuh Auth)

**Request:**
```
POST {{base_url}}/orders
```

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "tiket_id": 1,
  "jumlah_tiket": 2
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Pesanan berhasil dibuat",
  "data": {
    "id": 1,
    "user_id": 1,
    "tiket_id": 1,
    "jumlah_tiket": 2,
    "total_harga": "1000000.00",
    "status": "pending",
    ...
  }
}
```

---

### 10. GET List Orders (Butuh Auth)

**Request:**
```
GET {{base_url}}/orders
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters (Optional):**
- `status` - Filter berdasarkan status (contoh: `?status=pending`)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Riwayat pemesanan berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [...]
  }
}
```

---

### 11. CREATE Payment (Butuh Auth)

**Request:**
```
POST {{base_url}}/payments
```

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "order_id": 1,
  "amount": 1000000,
  "payment_method": "Bank Transfer"
}
```

**⚠️ Catatan:** Amount harus sama dengan total_harga order!

**Response Success (201):**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibuat",
  "data": {...}
}
```

---

### 12. GET List Payments (Butuh Auth)

**Request:**
```
GET {{base_url}}/payments
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters (Optional):**
- `status` - Filter berdasarkan status (contoh: `?status=pending`)
- `order_id` - Filter berdasarkan order_id (contoh: `?order_id=1`)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data pembayaran berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [...]
  }
}
```

---

### 13. UPDATE Payment Status (Butuh Auth)

**Request:**
```
PUT {{base_url}}/payments/1/status
```

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "status": "sukses"
}
```

**Status yang valid:** `pending`, `sukses`, `gagal`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Status pembayaran diperbarui",
  "data": {
    "id": 1,
    "status": "sukses",
    "order": {
      "status": "confirmed",
      ...
    }
  }
}
```

---

## Urutan Testing yang Disarankan

### Testing Tanpa Login (Public Endpoints)
1. ✅ GET /api/events (lihat list event)
2. ✅ GET /api/events/1 (lihat detail event)
3. ✅ GET /api/tikets (lihat list tiket)
4. ✅ GET /api/tikets/1 (lihat detail tiket)

### Testing dengan Login
1. POST /api/register (daftar akun baru)
2. POST /api/login (login dan dapatkan token)
3. GET /api/auth/profile (cek profile)
4. POST /api/events (buat event)
5. GET /api/events (lihat event yang dibuat)
6. POST /api/tikets (buat tiket untuk event)
7. POST /api/orders (buat order)
8. GET /api/orders (lihat order)
9. POST /api/payments (buat payment)
10. GET /api/payments (lihat payment)
11. PUT /api/payments/1/status (update status payment)

---

## Troubleshooting

### Error 401 Unauthorized
- Pastikan token sudah di-set di environment variable
- Pastikan header Authorization menggunakan format: `Bearer {{token}}`
- Pastikan token masih valid (belum expired)
- Coba login ulang untuk mendapatkan token baru

### Error 404 Not Found
- Pastikan endpoint URL benar
- Pastikan server Laravel berjalan
- Pastikan route sudah terdaftar dengan benar

### Error 422 Validation Error
- Periksa body request, pastikan semua field required terisi
- Periksa format data (contoh: email harus valid, angka harus numeric)
- Periksa response error untuk detail validasi

### Error 403 Forbidden
- Endpoint mungkin membutuhkan role admin
- Pastikan user memiliki permission yang sesuai

---

## Tips

1. **Gunakan Environment Variables**: Set token di environment variable agar bisa digunakan di semua request
2. **Save Responses**: Simpan response untuk referensi
3. **Test Error Cases**: Test juga error cases (invalid data, unauthorized, dll)
4. **Use Collections**: Buat Postman Collection untuk mengorganisir requests
5. **Use Tests**: Tambahkan tests di Postman untuk validate responses

---

## Quick Reference - Endpoint Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | /api/events | ❌ No | List events (PUBLIC) |
| GET | /api/events/{id} | ❌ No | Detail event (PUBLIC) |
| POST | /api/events | ✅ Yes | Create event |
| PUT | /api/events/{id} | ✅ Yes | Update event |
| DELETE | /api/events/{id} | ✅ Yes | Delete event |
| GET | /api/tikets | ❌ No | List tikets (PUBLIC) |
| GET | /api/tikets/{id} | ❌ No | Detail tiket (PUBLIC) |
| POST | /api/tikets | ✅ Yes | Create tiket |
| PUT | /api/tikets/{id} | ✅ Yes | Update tiket |
| DELETE | /api/tikets/{id} | ✅ Yes | Delete tiket |
| GET | /api/orders | ✅ Yes | List orders |
| POST | /api/orders | ✅ Yes | Create order |
| GET | /api/payments | ✅ Yes | List payments |
| POST | /api/payments | ✅ Yes | Create payment |
