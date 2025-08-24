<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(QuestionSeeder::class);
        \App\Models\Admin::create([
            'username' => 'admin',
            'password' => bcrypt('password'),
            'email' => 'admin@example.com',
        ]);
    }
}