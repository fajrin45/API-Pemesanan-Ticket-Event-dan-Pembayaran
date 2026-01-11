<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of activity logs.
     */
    public function index(Request $request)
    {
        $query = ActivityLog::with('user');

        // Filter by user_id (untuk admin bisa lihat semua, user hanya lihat sendiri)
        if (Auth::user()->role !== 'admin') {
            $query->where('user_id', Auth::id());
        } elseif ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $logs = $query->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Data log aktivitas berhasil diambil',
            'data' => $logs
        ]);
    }

    /**
     * Display the specified activity log.
     */
    public function show($id)
    {
        $log = ActivityLog::with('user')->findOrFail($id);

        // User hanya bisa lihat log sendiri, kecuali admin
        if (Auth::user()->role !== 'admin' && $log->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail log aktivitas',
            'data' => $log
        ]);
    }
}
