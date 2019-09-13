<?php
use App\Customer;
use Illuminate\Database\Seeder;
class CustomersTableSeeder extends Seeder
{
    public function run()
    {
        factory(Customer::class)->create();
    }
}