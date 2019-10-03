<?php

namespace App\Transformations;

use App\Invoice;
use App\Repositories\CustomerRepository;
use App\Customer;

trait InvoiceTransformable {

     /**
     * Transform the invoice
     *
     * @param Invoice $invoice
     * @return Invoice
     */
    protected function transformInvoice(Invoice $invoice) {
        $prop = new Invoice;

        $prop->id = (int) $invoice->id;
        $customer = $invoice->customer;
        $prop->first_name = $customer ? $customer->first_name : null;
        $prop->last_name = $customer ? $customer->last_name : null;
        $prop->due_date = $invoice->due_date;
        $prop->invoice_status = $invoice->invoiceStatus->name;
        $prop->payment_type = $invoice->paymentType->name;
        $prop->total = $invoice->total;

        return $prop;
    }

}
