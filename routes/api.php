<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TiketController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ActivityLogController;

/*
|--------------------------------------------------------------------------
| Public Routes (Tanpa Autentikasi)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

<<<<<<< HEAD
=======
// Public endpoints untuk melihat Event (GET saja)
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

// Public endpoints untuk melihat Tiket (GET saja)
Route::get('/tikets', [TiketController::class, 'index']);
Route::get('/tikets/{id}', [TiketController::class, 'show']);

>>>>>>> 6550547 (membuat ui frontend,penyesuaian code dan integrasi sistem)
/*
|--------------------------------------------------------------------------
| Protected Routes (Membutuhkan Autentikasi JWT)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    
    // Autentikasi & Profil User
    Route::prefix('auth')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });

<<<<<<< HEAD
    // Manajemen Event
    Route::apiResource('events', EventController::class);
    
    // Manajemen Tiket
    Route::apiResource('tikets', TiketController::class);
=======
    // Manajemen Event (POST, PUT, DELETE - membutuhkan auth)
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
    
    // Manajemen Tiket (POST, PUT, DELETE - membutuhkan auth)
    Route::post('/tikets', [TiketController::class, 'store']);
    Route::put('/tikets/{id}', [TiketController::class, 'update']);
    Route::delete('/tikets/{id}', [TiketController::class, 'destroy']);
>>>>>>> 6550547 (membuat ui frontend,penyesuaian code dan integrasi sistem)
    
    // Pemesanan Tiket
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']); // Riwayat pemesanan
        Route::post('/', [OrderController::class, 'store']); // Buat pesanan
        Route::get('/{id}', [OrderController::class, 'show']); // Detail pesanan
        Route::put('/{id}', [OrderController::class, 'update']); // Update pesanan
        Route::delete('/{id}', [OrderController::class, 'destroy']); // Hapus pesanan
    });
    
    // Pembayaran
    Route::prefix('payments')->group(function () {
<<<<<<< HEAD
        Route::post('/', [PaymentController::class, 'store']); // Buat pembayaran
=======
        Route::get('/', [PaymentController::class, 'index']); // List pembayaran
        Route::post('/', [PaymentController::class, 'store']); // Buat pembayaran
        Route::get('/{id}', [PaymentController::class, 'show']); // Detail pembayaran
>>>>>>> 6550547 (membuat ui frontend,penyesuaian code dan integrasi sistem)
        Route::put('/{id}/status', [PaymentController::class, 'updateStatus']); // Update status pembayaran
    });
    
    // Log Aktivitas
    Route::prefix('activity-logs')->group(function () {
        Route::get('/', [ActivityLogController::class, 'index']); // List log aktivitas
        Route::get('/{id}', [ActivityLogController::class, 'show']); // Detail log aktivitas
    });
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Membutuhkan Autentikasi JWT + Role Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:api', 'admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json([
            'success' => true,
            'message' => 'Selamat datang Admin'
        ]);
    });
});
