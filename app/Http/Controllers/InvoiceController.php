<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;

class InvoiceController extends Controller {

    private $invoiceLineRepository;

    public function __construct(InvoiceRepositoryInterface $invoiceRepository, InvoiceLineRepositoryInterface $invoiceLineRepository) {
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceLineRepository = $invoiceLineRepository;
    }

    public function store(Request $request) {

        $invoice = $this->invoiceRepository->createInvoice($request->all());

        $arrLines = json_decode($request->data, true);

        foreach ($arrLines as $arrLine) {
            $this->invoiceLineRepository->createInvoiceLine($invoice, $arrLine);
        }

        return $invoice->toJson();
    }
    
    /**
     * 
     * @param int $customer_id
     * @return type
     */
    public function show(int $customer_id) {
        
        $lines = $this->invoiceRepository->getInvoicesForCustomer($customer_id);
        
        return $lines->toJson();     
    }

}
