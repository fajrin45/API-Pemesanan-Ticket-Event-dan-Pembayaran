# 📋 Panduan Lengkap Testing API di Postman

Panduan ini akan membantu Anda untuk menguji semua endpoint API Pemesanan Tiket Event di Postman dari awal sampai akhir.

---

## 📌 Daftar Isi

1. [Setup Awal](#1-setup-awal)
2. [Konfigurasi Postman](#2-konfigurasi-postman)
3. [Testing Endpoint Public (Tanpa Login)](#3-testing-endpoint-public-tanpa-login)
4. [Testing Autentikasi](#4-testing-autentikasi)
5. [Testing Manajemen Event](#5-testing-manajemen-event)
6. [Testing Manajemen Tiket](#6-testing-manajemen-tiket)
7. [Testing Pemesanan (Order)](#7-testing-pemesanan-order)
8. [Testing Pembayaran (Payment)](#8-testing-pembayaran-payment)
9. [Testing Activity Logs](#9-testing-activity-logs)
10. [Testing Admin Dashboard](#10-testing-admin-dashboard)
11. [Troubleshooting](#11-troubleshooting)
12. [Checklist Testing](#12-checklist-testing)

---

## 1. Setup Awal

### 1.1 Pastikan Server Laravel Berjalan

Buka terminal/command prompt di folder project:

```bash
cd "d:\Uas pws\new\api-pemesanan-tiket-event"
php artisan serve
```

Server akan berjalan di: `http://localhost:8000`

**Base URL API:** `http://localhost:8000/api`

### 1.2 Pastikan Database Sudah Migrate

Jika belum, jalankan:

```bash
php artisan migrate
php artisan db:seed  # (Optional - untuk data sample)
```

---

## 2. Konfigurasi Postman

### 2.1 Buat Environment Baru

1. Klik **Environments** di sidebar kiri
2. Klik **+** (Create Environment)
3. Nama: `API Testing`
4. Tambahkan variables berikut:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:8000/api` | `http://localhost:8000/api` |
| `token` | (kosong) | (kosong) |

5. Klik **Save**
6. Pilih environment `API Testing` di dropdown (kanan atas)

### 2.2 Buat Collection Baru (Optional tapi Recommended)

1. Klik **Collections** di sidebar kiri
2. Klik **+** (Create Collection)
3. Nama: `API Pemesanan Tiket Event`
4. Klik **Save**

---

## 3. Testing Endpoint Public (Tanpa Login)

Endpoint ini bisa diakses **TANPA** perlu login/token.

### ✅ Test 1: GET List Events

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/events`
- **Headers:** (Tidak perlu Authorization)

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/events`
4. Klik **Send**

**Expected Response (200 OK):**
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

**Query Parameters (Optional):**
- `lokasi=Jakarta` - Filter berdasarkan lokasi
- `sort=asc` atau `sort=desc` - Sort berdasarkan tanggal

**Contoh dengan filter:**
```
GET {{base_url}}/events?lokasi=Jakarta&sort=desc
```

---

### ✅ Test 2: GET Detail Event

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/events/1`
- **Headers:** (Tidak perlu Authorization)

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/events/1` (ganti 1 dengan ID event yang ada)
4. Klik **Send**

**Expected Response (200 OK):**
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

**Note:** Jika event dengan ID tersebut tidak ada, akan mendapat response 404.

---

### ✅ Test 3: GET List Tikets

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/tikets`
- **Headers:** (Tidak perlu Authorization)

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/tikets`
4. Klik **Send**

**Expected Response (200 OK):**
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

**Query Parameters (Optional):**
- `event_id=1` - Filter berdasarkan event
- `jenis_tiket=VIP` - Filter berdasarkan jenis tiket

**Contoh dengan filter:**
```
GET {{base_url}}/tikets?event_id=1&jenis_tiket=VIP
```

---

### ✅ Test 4: GET Detail Tiket

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/tikets/1`
- **Headers:** (Tidak perlu Authorization)

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/tikets/1` (ganti 1 dengan ID tiket yang ada)
4. Klik **Send**

**Expected Response (200 OK):**
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
    "event": {
      "id": 1,
      "nama_event": "Konser Musik",
      ...
    }
  }
}
```

---

## 4. Testing Autentikasi

Endpoint autentikasi untuk register dan login.

### ✅ Test 5: Register User Baru

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Steps:**
1. Buat request baru
2. Pilih method: `POST`
3. Masukkan URL: `{{base_url}}/register`
4. Tab **Headers**: Tambahkan `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON` dari dropdown
   - Paste JSON body di atas
6. Klik **Send**

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Register berhasil",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2026-01-10T10:00:00.000000Z",
    "updated_at": "2026-01-10T10:00:00.000000Z"
  }
}
```

**Error Cases:**
- Email sudah terdaftar → 422 Validation Error
- Password kurang dari 6 karakter → 422 Validation Error
- Field kosong → 422 Validation Error

---

### ✅ Test 6: Login User

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Steps:**
1. Buat request baru
2. Pilih method: `POST`
3. Masukkan URL: `{{base_url}}/login`
4. Tab **Headers**: Tambahkan `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON`
   - Paste JSON body di atas
6. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzA0ODQzMjAwLCJleHAiOjE3MDQ4NDY4MDAsIm5iZiI6MTcwNDg0MzIwMCwianRpIjoiR1ZvT2Z5VnN4VkZ4d0VXSiIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjJlZjZlNTczYTY0NzVkYjA1NzU0YzFjIn0.xxxxxxxxxxxx",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**⚠️ IMPORTANT - Simpan Token:**
1. Copy token dari response (value dari field "token")
2. Buka **Environments** → Pilih `API Testing`
3. Edit variable `token`
4. Paste token di **Current Value**
5. Klik **Save**

**Error Cases:**
- Email/password salah → 401 Unauthorized
- Email tidak terdaftar → 401 Unauthorized

---

### ✅ Test 7: Get Profile (Butuh Token)

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/auth/profile`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/auth/profile`
4. Tab **Headers**: 
   - Key: `Authorization`
   - Value: `Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2026-01-10T10:00:00.000000Z",
    "updated_at": "2026-01-10T10:00:00.000000Z"
  }
}
```

**Error Cases:**
- Token tidak ada → 401 Unauthorized
- Token invalid/expired → 401 Unauthorized

---

### ✅ Test 8: Logout (Butuh Token)

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/logout`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `POST`
3. Masukkan URL: `{{base_url}}/auth/logout`
4. Tab **Headers**: 
   - Key: `Authorization`
   - Value: `Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

**Note:** Setelah logout, token menjadi invalid dan tidak bisa digunakan lagi.

---

### ✅ Test 9: Refresh Token (Butuh Token)

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/refresh`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `POST`
3. Masukkan URL: `{{base_url}}/auth/refresh`
4. Tab **Headers**: 
   - Key: `Authorization`
   - Value: `Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Token berhasil di-refresh",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.xxxxxxxxxxxx"
}
```

**⚠️ IMPORTANT:** Copy token baru dan update variable `token` di environment!

---

## 5. Testing Manajemen Event

Endpoint untuk CRUD Event (Create, Read, Update, Delete). **Butuh Token** untuk POST, PUT, DELETE.

### ✅ Test 10: Create Event (Butuh Token)

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/events`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "nama_event": "Konser Musik Rock",
  "deskripsi": "Konser musik rock terbaik dengan band-band terkenal",
  "tanggal_event": "2026-03-20 19:00:00",
  "lokasi": "Bandung"
}
```

**Steps:**
1. Buat request baru
2. Pilih method: `POST`
3. Masukkan URL: `{{base_url}}/events`
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON`
   - Paste JSON body di atas
6. Klik **Send**

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Event berhasil dibuat",
  "data": {
    "id": 2,
    "nama_event": "Konser Musik Rock",
    "deskripsi": "Konser musik rock terbaik dengan band-band terkenal",
    "tanggal_event": "2026-03-20 19:00:00",
    "lokasi": "Bandung",
    "created_at": "2026-01-10T10:00:00.000000Z",
    "updated_at": "2026-01-10T10:00:00.000000Z",
    "tikets": []
  }
}
```

**⚠️ SIMPAN ID EVENT** untuk testing berikutnya!

**Error Cases:**
- Field kosong → 422 Validation Error
- Format tanggal salah → 422 Validation Error
- Tidak ada token → 401 Unauthorized

---

### ✅ Test 11: Update Event (Butuh Token)

**Request:**
- **Method:** `PUT`
- **URL:** `{{base_url}}/events/{id}` (ganti {id} dengan ID event yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "nama_event": "Konser Musik Rock Updated",
  "lokasi": "Surabaya"
}
```

**Steps:**
1. Buat request baru
2. Pilih method: `PUT`
3. Masukkan URL: `{{base_url}}/events/2` (ganti 2 dengan ID event)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON`
   - Paste JSON body di atas (field yang ingin diupdate saja)
6. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Event berhasil diperbarui",
  "data": {
    "id": 2,
    "nama_event": "Konser Musik Rock Updated",
    "lokasi": "Surabaya",
    ...
  }
}
```

**Note:** Bisa update sebagian field saja (partial update).

---

### ✅ Test 12: Delete Event (Butuh Token)

**Request:**
- **Method:** `DELETE`
- **URL:** `{{base_url}}/events/{id}` (ganti {id} dengan ID event yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `DELETE`
3. Masukkan URL: `{{base_url}}/events/2` (ganti 2 dengan ID event)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Event berhasil dihapus (soft delete)"
}
```

**Note:** Soft delete - data tidak benar-benar dihapus dari database.

---

## 6. Testing Manajemen Tiket

Endpoint untuk CRUD Tiket. **Butuh Token** untuk POST, PUT, DELETE.

### ✅ Test 13: Create Tiket (Butuh Token)

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/tikets`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "event_id": 1,
  "jenis_tiket": "VIP",
  "harga": 500000,
  "kuota": 100
}
```

**Steps:**
1. Buat request baru
2. Pilih method: `POST`
3. Masukkan URL: `{{base_url}}/tikets`
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON`
   - Paste JSON body di atas (pastikan event_id ada)
6. Klik **Send**

**Expected Response (201 Created):**
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

**⚠️ SIMPAN ID TIKET** untuk testing order nanti!

**Error Cases:**
- event_id tidak ada → 422 Validation Error
- Field kosong → 422 Validation Error
- Harga/kuota negatif → 422 Validation Error

---

### ✅ Test 14: Update Tiket (Butuh Token)

**Request:**
- **Method:** `PUT`
- **URL:** `{{base_url}}/tikets/{id}` (ganti {id} dengan ID tiket yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "harga": 600000,
  "kuota": 150
}
```

**Steps:**
1. Buat request baru
2. Pilih method: `PUT`
3. Masukkan URL: `{{base_url}}/tikets/1` (ganti 1 dengan ID tiket)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON`
   - Paste JSON body di atas
6. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Tiket berhasil diperbarui",
  "data": {
    "id": 1,
    "harga": "600000.00",
    "kuota": 150,
    ...
  }
}
```

---

### ✅ Test 15: Delete Tiket (Butuh Token)

**Request:**
- **Method:** `DELETE`
- **URL:** `{{base_url}}/tikets/{id}` (ganti {id} dengan ID tiket yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `DELETE`
3. Masukkan URL: `{{base_url}}/tikets/1` (ganti 1 dengan ID tiket)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Tiket berhasil dihapus"
}
```

---

## 7. Testing Pemesanan (Order)

Endpoint untuk membuat dan mengelola pesanan tiket. **Butuh Token**.

### ✅ Test 16: Create Order (Butuh Token)

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/orders`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "tiket_id": 1,
  "jumlah_tiket": 2
}
```

**Steps:**
1. Buat request baru
2. Pilih method: `POST`
3. Masukkan URL: `{{base_url}}/orders`
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON`
   - Paste JSON body di atas (pastikan tiket_id ada dan kuota mencukupi)
6. Klik **Send**

**Expected Response (201 Created):**
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
    "tiket": {
      "id": 1,
      "jenis_tiket": "VIP",
      "harga": "500000.00",
      ...
    },
    "user": {...}
  }
}
```

**⚠️ SIMPAN ID ORDER** untuk testing payment nanti!

**Error Cases:**
- Kuota tidak mencukupi → 400 Bad Request
- tiket_id tidak ada → 422 Validation Error
- jumlah_tiket < 1 → 422 Validation Error

---

### ✅ Test 17: Get List Orders (Butuh Token)

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/orders`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/orders`
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
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
        "payment": null
      }
    ]
  }
}
```

**Query Parameters (Optional):**
- `status=pending` - Filter berdasarkan status (pending, confirmed, cancelled)

**Contoh:**
```
GET {{base_url}}/orders?status=pending
```

---

### ✅ Test 18: Get Detail Order (Butuh Token)

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/orders/{id}` (ganti {id} dengan ID order yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/orders/1` (ganti 1 dengan ID order)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
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
    "tiket": {
      "event": {
        "nama_event": "Konser Musik",
        ...
      },
      ...
    },
    "user": {...},
    "payment": null
  }
}
```

---

### ✅ Test 19: Update Order Status (Butuh Token)

**Request:**
- **Method:** `PUT`
- **URL:** `{{base_url}}/orders/{id}` (ganti {id} dengan ID order yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "status": "cancelled"
}
```

**Steps:**
1. Buat request baru
2. Pilih method: `PUT`
3. Masukkan URL: `{{base_url}}/orders/1` (ganti 1 dengan ID order)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON`
   - Paste JSON body di atas
6. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Pesanan berhasil diperbarui",
  "data": {
    "id": 1,
    "status": "cancelled",
    ...
  }
}
```

**Status yang valid:** `pending`, `confirmed`, `cancelled`

**Note:** Jika status diubah ke `cancelled`, kuota tiket akan dikembalikan.

---

### ✅ Test 20: Delete Order (Butuh Token)

**Request:**
- **Method:** `DELETE`
- **URL:** `{{base_url}}/orders/{id}` (ganti {id} dengan ID order yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `DELETE`
3. Masukkan URL: `{{base_url}}/orders/1` (ganti 1 dengan ID order)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Pesanan berhasil dihapus"
}
```

**Note:** Jika order belum cancelled, kuota akan dikembalikan.

---

## 8. Testing Pembayaran (Payment)

Endpoint untuk membuat dan mengelola pembayaran. **Butuh Token**.

### ✅ Test 21: Create Payment (Butuh Token)

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/payments`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "order_id": 1,
  "amount": 1000000,
  "payment_method": "Bank Transfer"
}
```

**⚠️ IMPORTANT:** 
- `amount` **HARUS SAMA** dengan `total_harga` dari order!
- Order harus status `pending`
- Order harus milik user yang login
- Order belum boleh punya payment

**Steps:**
1. Buat request baru
2. Pilih method: `POST`
3. Masukkan URL: `{{base_url}}/payments`
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON`
   - Paste JSON body di atas
6. Klik **Send**

**Expected Response (201 Created):**
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
    "created_at": "2026-01-10T10:00:00.000000Z",
    "order": {...},
    "user": {...}
  }
}
```

**⚠️ SIMPAN ID PAYMENT** untuk testing update status nanti!

**Error Cases:**
- Amount tidak sama dengan total_harga → 400 Bad Request
- Order sudah punya payment → 400 Bad Request
- Order bukan milik user → 403 Forbidden
- Order tidak ada → 422 Validation Error

---

### ✅ Test 22: Get List Payments (Butuh Token)

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/payments`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/payments`
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
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
        "order": {...},
        "user": {...}
      }
    ]
  }
}
```

**Query Parameters (Optional):**
- `status=pending` - Filter berdasarkan status (pending, sukses, gagal)
- `order_id=1` - Filter berdasarkan order_id

**Contoh:**
```
GET {{base_url}}/payments?status=pending&order_id=1
```

---

### ✅ Test 23: Get Detail Payment (Butuh Token)

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/payments/{id}` (ganti {id} dengan ID payment yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/payments/1` (ganti 1 dengan ID payment)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
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
    "order": {...},
    "user": {...}
  }
}
```

---

### ✅ Test 24: Update Payment Status (Butuh Token)

**Request:**
- **Method:** `PUT`
- **URL:** `{{base_url}}/payments/{id}/status` (ganti {id} dengan ID payment yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "status": "sukses"
}
```

**Steps:**
1. Buat request baru
2. Pilih method: `PUT`
3. Masukkan URL: `{{base_url}}/payments/1/status` (ganti 1 dengan ID payment)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`
5. Tab **Body**: 
   - Pilih `raw`
   - Pilih `JSON`
   - Paste JSON body di atas
6. Klik **Send**

**Expected Response (200 OK):**
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

**Status yang valid:** `pending`, `sukses`, `gagal`

**Note:** 
- Jika status diubah ke `sukses`, status order akan otomatis berubah ke `confirmed`
- Hanya owner payment atau admin yang bisa update status

---

## 9. Testing Activity Logs

Endpoint untuk melihat log aktivitas. **Butuh Token**.

### ✅ Test 25: Get List Activity Logs (Butuh Token)

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/activity-logs`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/activity-logs`
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
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
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ]
  }
}
```

**Query Parameters (Optional):**
- `user_id=1` - Filter berdasarkan user_id (hanya untuk admin)
- `sort_by=created_at` - Sort berdasarkan kolom
- `sort_order=desc` - Sort order (asc/desc)

**Contoh:**
```
GET {{base_url}}/activity-logs?sort_by=created_at&sort_order=desc
```

**Note:** 
- User biasa hanya bisa melihat log aktivitas sendiri
- Admin bisa melihat semua log aktivitas

---

### ✅ Test 26: Get Detail Activity Log (Butuh Token)

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/activity-logs/{id}` (ganti {id} dengan ID log yang ada)
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/activity-logs/1` (ganti 1 dengan ID log)
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Detail log aktivitas",
  "data": {
    "id": 1,
    "user_id": 1,
    "activity": "User login",
    "created_at": "2026-01-10T10:00:00.000000Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Note:** User hanya bisa melihat log miliknya sendiri (kecuali admin).

---

## 10. Testing Admin Dashboard

Endpoint khusus untuk admin. **Butuh Token + Role Admin**.

### ✅ Test 27: Admin Dashboard (Butuh Token + Admin Role)

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/admin/dashboard`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Steps:**
1. Buat request baru
2. Pilih method: `GET`
3. Masukkan URL: `{{base_url}}/admin/dashboard`
4. Tab **Headers**: 
   - `Authorization: Bearer {{token}}`
5. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Selamat datang Admin"
}
```

**Error Cases:**
- User bukan admin → 403 Forbidden
- Tidak ada token → 401 Unauthorized

**Note:** Untuk test ini, pastikan user yang login memiliki `role: "admin"`.

---

## 11. Troubleshooting

### Error 401 Unauthorized

**Masalah:** Token tidak ada, invalid, atau expired.

**Solusi:**
1. Pastikan sudah login dan mendapatkan token
2. Copy token dari response login
3. Paste token ke environment variable `token`
4. Pastikan header Authorization menggunakan format: `Bearer {{token}}`
5. Jika token expired, login ulang untuk mendapatkan token baru

---

### Error 403 Forbidden

**Masalah:** Tidak memiliki permission (misal: bukan admin).

**Solusi:**
1. Pastikan user memiliki role yang sesuai
2. Untuk admin endpoints, pastikan user memiliki `role: "admin"`

---

### Error 404 Not Found

**Masalah:** Endpoint atau resource tidak ditemukan.

**Solusi:**
1. Pastikan URL endpoint benar
2. Pastikan ID resource ada di database
3. Pastikan server Laravel berjalan
4. Cek route list dengan: `php artisan route:list --path=api`

---

### Error 422 Validation Error

**Masalah:** Data yang dikirim tidak valid.

**Solusi:**
1. Periksa body request, pastikan semua field required terisi
2. Periksa format data:
   - Email harus valid format
   - Password minimal 6 karakter
   - Number harus numeric
   - Date harus format yang benar
3. Lihat response error untuk detail field yang error

**Contoh Error Response:**
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

### Error 400 Bad Request

**Masalah:** Request tidak bisa diproses karena business logic error.

**Contoh:**
- Kuota tiket tidak mencukupi
- Amount payment tidak sama dengan total_harga
- Order sudah memiliki payment

**Solusi:**
1. Baca message error di response
2. Perbaiki data sesuai dengan business rules

---

### Token Tidak Tersimpan di Environment

**Solusi:**
1. Buka **Environments** → Pilih environment yang digunakan
2. Edit variable `token`
3. Paste token di **Current Value**
4. Pastikan environment dipilih di dropdown (kanan atas)

---

### Server Tidak Berjalan

**Masalah:** Request timeout atau connection refused.

**Solusi:**
1. Pastikan server Laravel berjalan:
   ```bash
   php artisan serve
   ```
2. Pastikan port 8000 tidak digunakan aplikasi lain
3. Cek URL base_url di environment variable

---

## 12. Checklist Testing

Gunakan checklist ini untuk memastikan semua endpoint sudah ditest:

### ✅ Public Endpoints (Tanpa Auth)
- [ ] GET /api/events
- [ ] GET /api/events/{id}
- [ ] GET /api/tikets
- [ ] GET /api/tikets/{id}

### ✅ Autentikasi
- [ ] POST /api/register
- [ ] POST /api/login
- [ ] GET /api/auth/profile
- [ ] POST /api/auth/logout
- [ ] POST /api/auth/refresh

### ✅ Manajemen Event (Butuh Auth)
- [ ] POST /api/events
- [ ] PUT /api/events/{id}
- [ ] DELETE /api/events/{id}

### ✅ Manajemen Tiket (Butuh Auth)
- [ ] POST /api/tikets
- [ ] PUT /api/tikets/{id}
- [ ] DELETE /api/tikets/{id}

### ✅ Pemesanan (Butuh Auth)
- [ ] POST /api/orders
- [ ] GET /api/orders
- [ ] GET /api/orders/{id}
- [ ] PUT /api/orders/{id}
- [ ] DELETE /api/orders/{id}

### ✅ Pembayaran (Butuh Auth)
- [ ] POST /api/payments
- [ ] GET /api/payments
- [ ] GET /api/payments/{id}
- [ ] PUT /api/payments/{id}/status

### ✅ Activity Logs (Butuh Auth)
- [ ] GET /api/activity-logs
- [ ] GET /api/activity-logs/{id}

### ✅ Admin (Butuh Auth + Admin Role)
- [ ] GET /api/admin/dashboard

### ✅ Error Cases
- [ ] Test dengan token invalid/expired
- [ ] Test dengan data invalid (422)
- [ ] Test dengan resource tidak ada (404)
- [ ] Test dengan permission tidak cukup (403)

---

## 📝 Tips & Best Practices

1. **Gunakan Environment Variables**: Simpan base_url dan token di environment untuk kemudahan
2. **Buat Collection**: Organisir requests dalam collection untuk kemudahan testing
3. **Save Responses**: Simpan contoh response untuk referensi
4. **Test Error Cases**: Jangan hanya test success cases, test juga error cases
5. **Use Tests Tab**: Tambahkan assertions di Tests tab untuk validate responses
6. **Document Requests**: Tambahkan description untuk setiap request
7. **Use Variables**: Gunakan collection/environment variables untuk ID yang sering digunakan

---

## 🔗 Quick Reference

### Base URL
```
http://localhost:8000/api
```

### Authentication Header Format
```
Authorization: Bearer {token}
```

### Content-Type untuk POST/PUT
```
Content-Type: application/json
```

### Status Code yang Umum
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## ✅ Selesai!

Selamat! Anda sudah menyelesaikan testing semua endpoint API di Postman. 

Jika ada pertanyaan atau masalah, silakan cek bagian **Troubleshooting** atau dokumentasi API di `docs/API_DOCUMENTATION.md`.

Happy Testing! 🚀
