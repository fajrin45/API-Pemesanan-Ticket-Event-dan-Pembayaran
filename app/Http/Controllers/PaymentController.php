<?php

namespace App\Http\Controllers;


use App\Models\Payment;
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
            'order_id' => 'required',
            'amount' => 'required|numeric',
            'payment_method' => 'required'
        ]);

        $payment = Payment::create([
            'user_id' => Auth::id(),
            'order_id' => $request->order_id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'status' => 'pending'
        ]);
        

        return response()->json([
            'message' => 'Pembayaran berhasil dibuat',
            'data' => $payment
        ]);
    }

    // Update status pembayaran
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,sukses,gagal'
        ]);

        $payment = Payment::findOrFail($id);
        $payment->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status pembayaran diperbarui',
            'data' => $payment
        ]);
    }
}

