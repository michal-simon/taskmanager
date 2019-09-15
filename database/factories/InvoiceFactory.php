<?php

use App\Invoice;

$factory->define(Invoice::class, function (Faker\Generator $faker) {
    return [
        'invoice_status' =>1,
        'total' => 2000,
        'customer_id' => 1,
        'payment_type' => 1,
    ];
});
