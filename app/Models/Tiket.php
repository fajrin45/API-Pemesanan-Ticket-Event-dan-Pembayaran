<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tiket extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'jenis_tiket',
        'harga',
        'kuota',
        'terjual'
    ];

    protected $casts = [
        'harga' => 'decimal:2',
    ];

    // Relasi ke Event
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    // Relasi ke Orders
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
