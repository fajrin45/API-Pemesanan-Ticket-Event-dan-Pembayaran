<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tiket;
use App\Models\Event;
<<<<<<< HEAD
use Illuminate\Http\Request;
=======
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
>>>>>>> 6550547 (membuat ui frontend,penyesuaian code dan integrasi sistem)

class TiketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Tiket::with('event');

        // Filter by event_id
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        // Filter by jenis_tiket
        if ($request->has('jenis_tiket')) {
            $query->where('jenis_tiket', $request->jenis_tiket);
        }

        $tikets = $query->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Data tiket berhasil diambil',
            'data' => $tikets
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'jenis_tiket' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'kuota' => 'required|integer|min:1'
        ]);

        $tiket = Tiket::create($request->all());

<<<<<<< HEAD
=======
        // Log aktivitas
        ActivityLog::create([
            'user_id' => Auth::id(),
            'activity' => 'Membuat tiket: ' . $tiket->jenis_tiket . ' untuk event ID ' . $tiket->event_id
        ]);

>>>>>>> 6550547 (membuat ui frontend,penyesuaian code dan integrasi sistem)
        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil dibuat',
            'data' => $tiket->load('event')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tiket = Tiket::with('event')->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Detail tiket',
            'data' => $tiket
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tiket = Tiket::findOrFail($id);

        $validated = $request->validate([
            'event_id' => 'sometimes|exists:events,id',
            'jenis_tiket' => 'sometimes|string|max:255',
            'harga' => 'sometimes|numeric|min:0',
            'kuota' => 'sometimes|integer|min:1'
        ]);

        $tiket->update($validated);

<<<<<<< HEAD
=======
        // Log aktivitas
        ActivityLog::create([
            'user_id' => Auth::id(),
            'activity' => 'Memperbarui tiket ID ' . $tiket->id
        ]);

>>>>>>> 6550547 (membuat ui frontend,penyesuaian code dan integrasi sistem)
        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil diperbarui',
            'data' => $tiket->load('event')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tiket = Tiket::findOrFail($id);
<<<<<<< HEAD
        $tiket->delete();

=======
        $tiketId = $tiket->id;
        $tiket->delete();

        // Log aktivitas
        ActivityLog::create([
            'user_id' => Auth::id(),
            'activity' => 'Menghapus tiket ID ' . $tiketId
        ]);

>>>>>>> 6550547 (membuat ui frontend,penyesuaian code dan integrasi sistem)
        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil dihapus'
        ]);
    }
}
