<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nama_event' => $this->faker->sentence(3),
            'deskripsi' => $this->faker->paragraph(),
            'tanggal_event' => $this->faker->dateTimeBetween('+1 days', '+1 month'),
            'lokasi' => $this->faker->city(),
            'harga_tiket' => $this->faker->numberBetween(50000, 300000),
            'kuota' => $this->faker->numberBetween(50, 500),
        ];
    }
}
