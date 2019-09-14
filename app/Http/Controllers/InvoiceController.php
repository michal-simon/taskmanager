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

        if(!empty($request->invoice_id)) {
            $invoice = $this->invoiceRepository->findInvoiceById($request->invoice_id);
        } else {
            $invoice = $this->invoiceRepository->createInvoice($request->all());
        }
        
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
    public function show(int $invoice_id) {
        
        try {
            $lines = $this->invoiceRepository->getInvoicesByIdWithLines($invoice_id);
             return $lines->toJson();  
        } catch (Exception $ex) {
            echo $ex->getException();
            die;
        }

    }

}
