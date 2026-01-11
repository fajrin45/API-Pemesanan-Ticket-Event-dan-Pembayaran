<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Tiket;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource (Riwayat pemesanan user).
     */
    public function index(Request $request)
    {
        $query = Order::with(['tiket.event', 'user', 'payment'])
            ->where('user_id', Auth::id());

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Riwayat pemesanan berhasil diambil',
            'data' => $orders
        ]);
    }

    /**
     * Store a newly created resource in storage (Membuat pesanan tiket).
     */
    public function store(Request $request)
    {
        $request->validate([
            'tiket_id' => 'required|exists:tikets,id',
            'jumlah_tiket' => 'required|integer|min:1'
        ]);

        $tiket = Tiket::findOrFail($request->tiket_id);

        // Cek ketersediaan tiket
        $sisaKuota = $tiket->kuota - $tiket->terjual;
        if ($request->jumlah_tiket > $sisaKuota) {
            return response()->json([
                'success' => false,
                'message' => 'Kuota tiket tidak mencukupi. Sisa kuota: ' . $sisaKuota
            ], 400);
        }

        // Hitung total harga
        $totalHarga = $tiket->harga * $request->jumlah_tiket;

        // Buat order
        $order = Order::create([
            'user_id' => Auth::id(),
            'tiket_id' => $request->tiket_id,
            'jumlah_tiket' => $request->jumlah_tiket,
            'total_harga' => $totalHarga,
            'status' => 'pending'
        ]);

        // Update terjual
        $tiket->increment('terjual', $request->jumlah_tiket);

        // Log aktivitas
        ActivityLog::create([
            'user_id' => Auth::id(),
            'activity' => 'Membuat pesanan tiket dengan order ID ' . $order->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat',
            'data' => $order->load(['tiket.event', 'user'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with(['tiket.event', 'user', 'payment'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Detail pesanan',
            'data' => $order
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $order = Order::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,confirmed,cancelled'
        ]);

        // Jika status diubah menjadi cancelled, kembalikan kuota
        if (isset($validated['status']) && $validated['status'] === 'cancelled' && $order->status !== 'cancelled') {
            $order->tiket->decrement('terjual', $order->jumlah_tiket);
        }

        $order->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil diperbarui',
            'data' => $order->load(['tiket.event', 'user'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $order = Order::where('user_id', Auth::id())->findOrFail($id);

        // Kembalikan kuota jika belum cancelled
        if ($order->status !== 'cancelled') {
            $order->tiket->decrement('terjual', $order->jumlah_tiket);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dihapus'
        ]);
    }
}
