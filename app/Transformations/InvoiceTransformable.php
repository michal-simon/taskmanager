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

        try {
            $customer = (new CustomerRepository(new Customer))->findCustomerById($invoice->customer_id);
        } catch (Exception $ex) {
            $customer = null;
        }


        switch ($invoice->invoice_status) {
            case 1:
                $status = 'Draft';
                break;
            case 2:
                $status = 'Sent';
                break;
            case 3:
                $status = 'Paid';
                break;

            default:
                $status = 'Draft';
                break;
        }

        $prop->id = (int) $invoice->id;

        $prop->first_name = $customer ? $customer->first_name : null;
        $prop->last_name = $customer ? $customer->last_name : null;
        $prop->due_date = $invoice->due_date;
        $prop->invoice_status = $status;
        $prop->payment_type = $invoice->payment_type;
        $prop->total = $invoice->total;

        return $prop;
    }

}
