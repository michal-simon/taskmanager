<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        factory(App\User::class, 50)->create();
        $this->call(leadColumns::class);
        $this->call(SourceTypeSeeder::class);
        $this->call(TaskSeeder::class);
    }

}
