<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\InvoiceRepository;
use App\Repositories\InvoiceLineRepository;
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;

class InvoiceController extends Controller {

    private $invoiceLineRepository;

    public function __construct(InvoiceRepositoryInterface $invoiceRepository, InvoiceLineRepositoryInterface $invoiceLineRepository) {
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceLineRepository = $invoiceLineRepository;
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function index(Request $request) {
        $orderBy = !$request->column ? 'due_date' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;

        $users = $this->invoiceRepository->listInvoices($orderBy, $orderDir, ['*']);
        return $users->toJson();
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function store(Request $request) {
        
        if (!empty($request->invoice_id)) {
            $invoice = $this->invoiceRepository->findInvoiceById($request->invoice_id);
            $invoiceRepo = new InvoiceRepository($invoice);
            $invoiceRepo->updateInvoice($request->all());
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
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroyLine(int $id)
    {
        $customer = $this->invoiceLineRepository->findLineById($id);
        $customerRepo = new InvoiceLineRepository($customer);
        $customerRepo->deleteLine();
    }

}
