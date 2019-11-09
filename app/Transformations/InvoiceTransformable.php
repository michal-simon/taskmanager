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
        $prop->customer_id = $invoice->customer_id;
        $prop->first_name = $customer ? $customer->first_name : null;
        $prop->last_name = $customer ? $customer->last_name : null;
        $prop->due_date = $invoice->due_date;
        $prop->finance_type = $invoice->finance_type;
        $prop->invoice_status = 'Pending';
        $prop->payment_type = $invoice->paymentType->name;
        $prop->total = $invoice->total;
        $prop->sub_total = $invoice->sub_total;
        $prop->tax_total = $invoice->tax_total;
        $prop->discount_total = $invoice->discount_total;

        return $prop;
    }

}
