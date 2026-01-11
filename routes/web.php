<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Serve SPA frontend
Route::get('/', function () {
    return file_get_contents(public_path('index.html'));
});

// Catch-all route for SPA (exclude API and asset files)
Route::get('/{any}', function ($path) {
    // Don't serve HTML for API routes or asset files
    if (strpos($path, 'api/') === 0 || 
        preg_match('/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i', $path)) {
        abort(404);
    }
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api).*$');
