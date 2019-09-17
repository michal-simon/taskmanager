<?php
namespace App\Transformations;

use App\Invoice;
use App\Repositories\CustomerRepository;
use App\Customer;

trait InvoiceTransformable
{
    protected function transformInvoice(Invoice $invoice)
    {
        $prop = new Invoice;
        
        $customer = (new CustomerRepository(new Customer))->findCustomerById($invoice->customer_id);
        
        switch($invoice->invoice_status) {
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
        $prop->first_name = $customer->first_name;
        $prop->last_name = $customer->last_name;
        $prop->due_date = $invoice->due_date;
        $prop->invoice_status = $status;
        $prop->payment_type = $invoice->payment_type;
        $prop->total = $invoice->total;
        
        return $prop;
    }
}