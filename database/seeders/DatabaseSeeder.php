<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
   public function run(): void
{
<<<<<<< HEAD
    $this->call(EventSeeder::class);
=======
    $this->call([
        AdminSeeder::class,
        EventSeeder::class,
    ]);
>>>>>>> 6550547 (membuat ui frontend,penyesuaian code dan integrasi sistem)
}

}
