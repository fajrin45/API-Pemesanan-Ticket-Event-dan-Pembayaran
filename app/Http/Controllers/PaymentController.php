<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ActivityLog;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments.
     */
    public function index(Request $request)
    {
        $query = Payment::with(['order.tiket.event', 'user'])
            ->where('user_id', Auth::id());

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by order_id
        if ($request->has('order_id')) {
            $query->where('order_id', $request->order_id);
        }

        $payments = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Data pembayaran berhasil diambil',
            'data' => $payments
        ]);
    }

    /**
     * Display the specified payment.
     */
    public function show($id)
    {
        $payment = Payment::with(['order.tiket.event', 'user'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Detail pembayaran',
            'data' => $payment
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(Request $request)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'activity' => 'Membuat pembayaran order ID ' . $request->order_id
        ]);

        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:255'
        ]);

        // Cek apakah order milik user yang login
        $order = Order::findOrFail($request->order_id);
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke order ini'
            ], 403);
        }

        // Cek apakah order sudah memiliki payment
        if ($order->payment) {
            return response()->json([
                'success' => false,
                'message' => 'Order ini sudah memiliki pembayaran'
            ], 400);
        }

        // Validasi amount harus sama dengan total_harga order
        if (abs($request->amount - $order->total_harga) > 0.01) {
            return response()->json([
                'success' => false,
                'message' => 'Jumlah pembayaran harus sama dengan total harga order'
            ], 400);
        }

        $payment = Payment::create([
            'user_id' => Auth::id(),
            'order_id' => $request->order_id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'status' => 'pending'
        ]);
        

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil dibuat',
            'data' => $payment->load(['order.tiket.event', 'user'])
        ], 201);
    }

    /**
     * Update the payment status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,sukses,gagal'
        ]);

        $payment = Payment::findOrFail($id);

        // Cek apakah payment milik user yang login (kecuali admin)
        if (Auth::user()->role !== 'admin' && $payment->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke pembayaran ini'
            ], 403);
        }

        $payment->update(['status' => $request->status]);

        // Update status order jika pembayaran sukses
        if ($request->status === 'sukses' && $payment->order) {
            $payment->order->update(['status' => 'confirmed']);
            
            ActivityLog::create([
                'user_id' => Auth::id(),
                'activity' => 'Pembayaran sukses untuk order ID ' . $payment->order_id
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran diperbarui',
            'data' => $payment->load('order')
        ]);
    }
}

