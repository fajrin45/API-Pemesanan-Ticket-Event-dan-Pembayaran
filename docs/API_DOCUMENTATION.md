# Dokumentasi API - API Pemesanan Tiket Event dan Pembayaran

**Dibuat oleh:** fajrin  
**Tanggal:** 2026

## Base URL
```
http://localhost:8000/api
```

## Autentikasi
API menggunakan JWT (JSON Web Token) untuk autentikasi. Setelah login, sertakan token dalam header:
```
Authorization: Bearer {token}
```

## Struktur Database

### Tabel Events
- `id` (bigint, primary key)
- `nama_event` (string)
- `deskripsi` (text)
- `tanggal_event` (datetime)
- `lokasi` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable) - Soft delete

### Tabel Tikets
- `id` (bigint, primary key)
- `event_id` (bigint, foreign key ke events)
- `jenis_tiket` (string) - VIP, Regular, Early Bird, dll
- `harga` (decimal 12,2)
- `kuota` (integer)
- `terjual` (integer, default: 0)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tabel Orders
- `id` (bigint, primary key)
- `user_id` (bigint, foreign key ke users)
- `tiket_id` (bigint, foreign key ke tikets)
- `jumlah_tiket` (integer)
- `total_harga` (decimal 12,2)
- `status` (enum: 'pending', 'confirmed', 'cancelled', default: 'pending')
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tabel Payments
- `id` (bigint, primary key)
- `user_id` (bigint, foreign key ke users)
- `order_id` (bigint, foreign key ke orders)
- `amount` (decimal 12,2)
- `status` (enum: 'pending', 'sukses', 'gagal', default: 'pending')
- `payment_method` (string, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tabel Users
- `id` (bigint, primary key)
- `name` (string)
- `email` (string, unique)
- `password` (string, hashed)
- `role` (enum: 'user', 'admin', default: 'user')
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## 1. Autentikasi

### 1.1 Register Pengguna Baru
**Endpoint:** `POST /api/register`

**Request Body:**
```json
{
  "name": "fajrin",
  "email": "fajrin@example.com",
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
    "name": "fajrin",
    "email": "fajrin@example.com",
    "role": "user",
    "created_at": "2026-01-10T10:00:00.000000Z",
    "updated_at": "2026-01-10T10:00:00.000000Z"
  }
}
```

**Response Error (422):**
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

### 1.2 Login
**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "email": "fajrin@example.com",
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
    "name": "fajrin",
    "email": "fajrin@example.com",
    "role": "user"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

### 1.3 Get Profile
**Endpoint:** `GET /api/auth/profile`  
**Authentication:** Required

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "fajrin",
    "email": "fajrin@example.com",
    "role": "user",
    "created_at": "2026-01-10T10:00:00.000000Z",
    "updated_at": "2026-01-10T10:00:00.000000Z"
  }
}
```

---

### 1.4 Logout
**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### 1.5 Refresh Token
**Endpoint:** `POST /api/auth/refresh`  
**Authentication:** Required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Token berhasil di-refresh",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## 2. Manajemen Event

### 2.1 Get List Events
**Endpoint:** `GET /api/events`
**Authentication:** Tidak Diperlukan (Public)

**Query Parameters:**
- `lokasi` (optional): Filter berdasarkan lokasi
- `sort` (optional): Sort berdasarkan tanggal_event (asc/desc)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data event berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "nama_event": "Konser Musik",
        "deskripsi": "Konser musik akustik",
        "tanggal_event": "2026-02-15 19:00:00",
        "lokasi": "Jakarta",
        "created_at": "2026-01-10T10:00:00.000000Z",
        "updated_at": "2026-01-10T10:00:00.000000Z",
        "tikets": []
      }
    ],
    "per_page": 10,
    "total": 1
  }
}
```

---

### 2.2 Create Event
**Endpoint:** `POST /api/events`
**Authentication:** Diperlukan (Bearer Token)

**Request Body:**
```json
{
  "nama_event": "Konser Musik",
  "deskripsi": "Konser musik akustik",
  "tanggal_event": "2026-02-15 19:00:00",
  "lokasi": "Jakarta"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Event berhasil dibuat",
  "data": {
    "id": 1,
    "nama_event": "Konser Musik",
    "deskripsi": "Konser musik akustik",
    "tanggal_event": "2026-02-15 19:00:00",
    "lokasi": "Jakarta",
    "created_at": "2026-01-10T10:00:00.000000Z",
    "updated_at": "2026-01-10T10:00:00.000000Z"
  }
}
```

---

### 2.3 Get Event Detail
**Endpoint:** `GET /api/events/{id}`
**Authentication:** Tidak Diperlukan (Public)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Detail event",
  "data": {
    "id": 1,
    "nama_event": "Konser Musik",
    "deskripsi": "Konser musik akustik",
    "tanggal_event": "2026-02-15 19:00:00",
    "lokasi": "Jakarta",
    "tikets": [
      {
        "id": 1,
        "event_id": 1,
        "jenis_tiket": "VIP",
        "harga": "500000.00",
        "kuota": 100,
        "terjual": 0
      }
    ]
  }
}
```

---

### 2.4 Update Event
**Endpoint:** `PUT /api/events/{id}`
**Authentication:** Diperlukan (Bearer Token)

**Request Body:**
```json
{
  "nama_event": "Konser Musik Updated",
  "lokasi": "Bandung"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Event berhasil diperbarui",
  "data": {
    "id": 1,
    "nama_event": "Konser Musik Updated",
    "lokasi": "Bandung",
    ...
  }
}
```

---

### 2.5 Delete Event
**Endpoint:** `DELETE /api/events/{id}`
**Authentication:** Diperlukan (Bearer Token)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Event berhasil dihapus (soft delete)"
}
```

---

## 3. Manajemen Tiket

### 3.1 Get List Tikets
**Endpoint:** `GET /api/tikets`
**Authentication:** Tidak Diperlukan (Public)

**Query Parameters:**
- `event_id` (optional): Filter berdasarkan event_id
- `jenis_tiket` (optional): Filter berdasarkan jenis_tiket

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data tiket berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "event_id": 1,
        "jenis_tiket": "VIP",
        "harga": "500000.00",
        "kuota": 100,
        "terjual": 0,
        "event": {
          "id": 1,
          "nama_event": "Konser Musik",
          ...
        }
      }
    ]
  }
}
```

---

### 3.2 Create Tiket
**Endpoint:** `POST /api/tikets`
**Authentication:** Diperlukan (Bearer Token)

**Request Body:**
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

### 3.3 Get Tiket Detail
**Endpoint:** `GET /api/tikets/{id}`
**Authentication:** Tidak Diperlukan (Public)

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

### 3.4 Update Tiket
**Endpoint:** `PUT /api/tikets/{id}`
**Authentication:** Diperlukan (Bearer Token)

**Request Body:**
```json
{
  "harga": 600000,
  "kuota": 150
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Tiket berhasil diperbarui",
  "data": {...}
}
```

---

### 3.5 Delete Tiket
**Endpoint:** `DELETE /api/tikets/{id}`
**Authentication:** Diperlukan (Bearer Token)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Tiket berhasil dihapus"
}
```

---

## 4. Pemesanan Tiket

### 4.1 Get Riwayat Pemesanan
**Endpoint:** `GET /api/orders`  
**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter berdasarkan status (pending, confirmed, cancelled)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Riwayat pemesanan berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "tiket_id": 1,
        "jumlah_tiket": 2,
        "total_harga": "1000000.00",
        "status": "pending",
        "tiket": {...},
        "user": {...},
        "payment": {...}
      }
    ]
  }
}
```

---

### 4.2 Create Pesanan
**Endpoint:** `POST /api/orders`  
**Authentication:** Required

**Request Body:**
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
    "tiket": {...},
    "user": {...}
  }
}
```

**Response Error (400) - Kuota tidak mencukupi:**
```json
{
  "success": false,
  "message": "Kuota tiket tidak mencukupi. Sisa kuota: 5"
}
```

---

### 4.3 Get Detail Pesanan
**Endpoint:** `GET /api/orders/{id}`  
**Authentication:** Required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Detail pesanan",
  "data": {
    "id": 1,
    "user_id": 1,
    "tiket_id": 1,
    "jumlah_tiket": 2,
    "total_harga": "1000000.00",
    "status": "pending",
    "tiket": {...},
    "user": {...},
    "payment": {...}
  }
}
```

---

### 4.4 Update Pesanan
**Endpoint:** `PUT /api/orders/{id}`  
**Authentication:** Required

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Pesanan berhasil diperbarui",
  "data": {...}
}
```

---

### 4.5 Delete Pesanan
**Endpoint:** `DELETE /api/orders/{id}`  
**Authentication:** Required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Pesanan berhasil dihapus"
}
```

---

## 5. Pembayaran

### 5.1 Get List Pembayaran
**Endpoint:** `GET /api/payments`  
**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter berdasarkan status (pending, sukses, gagal)
- `order_id` (optional): Filter berdasarkan order_id

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data pembayaran berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "order_id": 1,
        "amount": "1000000.00",
        "status": "pending",
        "payment_method": "Bank Transfer",
        "created_at": "2026-01-10T10:00:00.000000Z",
        "order": {
          "id": 1,
          "total_harga": "1000000.00",
          "tiket": {...},
          "event": {...}
        },
        "user": {...}
      }
    ]
  }
}
```

---

### 5.2 Get Detail Pembayaran
**Endpoint:** `GET /api/payments/{id}`  
**Authentication:** Required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Detail pembayaran",
  "data": {
    "id": 1,
    "user_id": 1,
    "order_id": 1,
    "amount": "1000000.00",
    "status": "pending",
    "payment_method": "Bank Transfer",
    "created_at": "2026-01-10T10:00:00.000000Z",
    "order": {...},
    "user": {...}
  }
}
```

---

### 5.3 Create Pembayaran
**Endpoint:** `POST /api/payments`  
**Authentication:** Required

**Request Body:**
```json
{
  "order_id": 1,
  "amount": 1000000,
  "payment_method": "Bank Transfer"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibuat",
  "data": {
    "id": 1,
    "user_id": 1,
    "order_id": 1,
    "amount": "1000000.00",
    "status": "pending",
    "payment_method": "Bank Transfer",
    "created_at": "2026-01-10T10:00:00.000000Z"
  }
}
```

---

### 5.4 Update Status Pembayaran
**Endpoint:** `PUT /api/payments/{id}/status`  
**Authentication:** Required

**Request Body:**
```json
{
  "status": "sukses"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Status pembayaran diperbarui",
  "data": {
    "id": 1,
    "status": "sukses",
    "order": {
      "id": 1,
      "status": "confirmed",
      ...
    }
  }
}
```

---

## 6. Log Aktivitas

### 6.1 Get List Log Aktivitas
**Endpoint:** `GET /api/activity-logs`  
**Authentication:** Required

**Query Parameters:**
- `user_id` (optional): Filter berdasarkan user_id (hanya untuk admin)
- `sort_by` (optional): Sort berdasarkan kolom (default: created_at)
- `sort_order` (optional): Sort order (asc/desc, default: desc)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data log aktivitas berhasil diambil",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "activity": "User login",
        "created_at": "2026-01-10T10:00:00.000000Z",
        "user": {
          "id": 1,
          "name": "fajrin",
          "email": "fajrin@example.com"
        }
      }
    ]
  }
}
```

---

### 6.2 Get Detail Log Aktivitas
**Endpoint:** `GET /api/activity-logs/{id}`  
**Authentication:** Required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Detail log aktivitas",
  "data": {
    "id": 1,
    "user_id": 1,
    "activity": "User login",
    "created_at": "2026-01-10T10:00:00.000000Z",
    "user": {...}
  }
}
```

---

## Error Response Format

Semua error response mengikuti format berikut:

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthenticated."
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "message": "No query results for model [App\\Models\\Event] 1"
}
```

**422 Validation Error:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 6 characters."]
  }
}
```

---

## Status Code

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Catatan Penting

### Relasi Database

1. **Events → Tikets**: One to Many (satu event bisa punya banyak tiket)
2. **Tikets → Orders**: One to Many (satu tiket bisa dipesan banyak kali)
3. **Users → Orders**: One to Many (satu user bisa punya banyak order)
4. **Orders → Payments**: One to One (satu order punya satu payment)
5. **Users → Payments**: One to Many (satu user bisa punya banyak payment)

### Validasi Penting

- **Order**: 
  - `jumlah_tiket` harus <= sisa kuota tiket
  - `total_harga` = `harga tiket` × `jumlah_tiket`
  
- **Payment**:
  - `amount` harus sama dengan `total_harga` dari order
  - Order harus status `pending` dan belum punya payment
  - Order harus milik user yang login

- **Tiket**:
  - `harga` harus >= 0
  - `kuota` harus >= 1
  - `terjual` tidak bisa lebih besar dari `kuota`

### Soft Delete

- Event menggunakan **soft delete**, artinya data tidak benar-benar dihapus dari database
- Data yang di-soft delete masih ada di database dengan `deleted_at` terisi
- Untuk melihat data yang sudah dihapus, perlu query khusus

---

**Dokumentasi ini dibuat oleh fajrin untuk keperluan Ujian Akhir Semester (UAS) Mata Kuliah Pemrograman Web Service.**
