<?php

use App\Invoice;
use App\Customer;

$factory->define(Invoice::class, function (Faker\Generator $faker) {

    $customer = factory(Customer::class)->create();

    return [
        'invoice_status' => 1,
        'total' => $faker->randomFloat(),
        'tax_total' => $faker->randomFloat(),
        'discount_total' => $faker->randomFloat(),
        'customer_id' => $customer->id,
        'payment_type' => 1,
    ];
});
