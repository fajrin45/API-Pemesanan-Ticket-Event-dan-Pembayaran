<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tiket_id',
        'jumlah_tiket',
        'total_harga',
        'status'
    ];

    protected $casts = [
        'total_harga' => 'decimal:2',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Tiket
    public function tiket()
    {
        return $this->belongsTo(Tiket::class);
    }

    // Relasi ke Payment
    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id');
    }
}
