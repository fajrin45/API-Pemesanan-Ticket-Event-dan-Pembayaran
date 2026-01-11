<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan kolom role ada di tabel users
        if (!DB::getSchemaBuilder()->hasColumn('users', 'role')) {
            $this->command->error('Kolom role belum ada di tabel users. Jalankan migration terlebih dahulu!');
            $this->command->info('Jalankan: php artisan migrate');
            return;
        }

        // Buat admin user jika belum ada
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin'
            ]
        );

        // Update role jika user sudah ada tapi bukan admin
        if ($admin->role !== 'admin') {
            $admin->update(['role' => 'admin']);
            $this->command->info('User admin@example.com di-update menjadi admin');
        }

        // Buat user biasa untuk testing
        $user = User::firstOrCreate(
            ['email' => 'fajrin@example.com'],
            [
                'name' => 'fajrin',
                'password' => Hash::make('password123'),
                'role' => 'user'
            ]
        );

        // Update role jika user sudah ada tapi bukan user
        if ($user->role !== 'user') {
            $user->update(['role' => 'user']);
        }

        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('Admin user berhasil dibuat!');
        $this->command->info('========================================');
        $this->command->info('Email: admin@example.com');
        $this->command->info('Password: password123');
        $this->command->info('Role: admin');
        $this->command->info('');
        $this->command->info('User biasa juga dibuat:');
        $this->command->info('Email: fajrin@example.com');
        $this->command->info('Password: password123');
        $this->command->info('Role: user');
        $this->command->info('========================================');
    }
}
