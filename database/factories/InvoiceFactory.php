<?php

use App\Invoice;
use App\Customer;

$factory->define(Invoice::class, function (Faker\Generator $faker) {
    
    $customer = factory(Customer::class)->create();
    
    return [
        'invoice_status' =>1,
        'total' => 2000,
        'customer_id' => $customer->id,
        'payment_type' => 1,
    ];
});
