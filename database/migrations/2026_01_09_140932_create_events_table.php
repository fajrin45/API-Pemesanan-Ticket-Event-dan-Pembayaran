<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
        $table->id();
        $table->string('nama_event');
        $table->text('deskripsi');
        $table->dateTime('tanggal_event');
        $table->string('lokasi');
        $table->integer('harga_tiket');
        $table->integer('kuota');
        $table->timestamps();
        $table->softDeletes();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
