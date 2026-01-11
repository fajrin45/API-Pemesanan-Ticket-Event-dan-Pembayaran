<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ActivityLog;

class PaymentController extends Controller
{
    // Buat pembayaran (simulasi)
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
            'data' => $payment
        ], 201);
    }

    // Update status pembayaran
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,sukses,gagal'
        ]);

        $payment = Payment::findOrFail($id);
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

