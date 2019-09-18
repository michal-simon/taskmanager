<?php
use App\Invoice;
use App\InvoiceLine;

$factory->define(InvoiceLine::class, function (Faker\Generator $faker) {
    
     $invoice = factory(Invoice::class)->create();
    
    return [
        'invoice_id' => $invoice->id,
        'quantity' => 2,
        'description' => 'Test Description',
        'unit_price' => 10.99,
        'invoice_status' => 1
    ];
});