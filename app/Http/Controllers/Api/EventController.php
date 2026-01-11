<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // GET /api/events
    public function index(Request $request)
    {
        $query = Event::with('tikets');

        // filter lokasi
        if ($request->has('lokasi')) {
            $query->where('lokasi', $request->lokasi);
        }

        // sorting tanggal_event
        if ($request->has('sort')) {
            $query->orderBy('tanggal_event', $request->sort);
        } else {
            $query->orderBy('tanggal_event', 'asc');
        }

        $events = $query->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Data event berhasil diambil',
            'data' => $events
        ]);
    }

    // POST /api/events
    public function store(Request $request)
    {
        $request->validate([
            'nama_event' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_event' => 'required|date',
            'lokasi' => 'required|string|max:255',
        ]);

        $event = Event::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil dibuat',
            'data' => $event
        ], 201);
    }

    // GET /api/events/{id}
    public function show($id)
    {
        $event = Event::with('tikets')->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Detail event',
            'data' => $event
        ]);
    }

    // PUT /api/events/{id}
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'nama_event' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'tanggal_event' => 'sometimes|date',
            'lokasi' => 'sometimes|string|max:255'
        ]);

        $event->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil diperbarui',
            'data' => $event
        ]);
    }

    // DELETE /api/events/{id}
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil dihapus (soft delete)'
        ]);
    }
}
