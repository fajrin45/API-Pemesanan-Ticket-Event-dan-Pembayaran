<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'nama_event',
        'deskripsi',
        'tanggal_event',
        'lokasi'
    ];

    protected $casts = [
        'tanggal_event' => 'datetime',
    ];

    // Relasi ke Tikets
    public function tikets()
    {
        return $this->hasMany(Tiket::class);
    }
}
