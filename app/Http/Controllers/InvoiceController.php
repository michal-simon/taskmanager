<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\InvoiceRepository;
use App\Repositories\InvoiceLineRepository;
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;
use App\Transformations\InvoiceTransformable;
use App\Invoice;

class InvoiceController extends Controller {

    use InvoiceTransformable;

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

        if (request()->has('search_term') && !empty($request->search_term)) {
            $list = $this->invoiceRepository->searchInvoice(request()->input('search_term'));
        } else {
            $list = $this->invoiceRepository->listInvoices($orderBy, $orderDir, ['*']);
        }

        $invoices = $list->map(function (Invoice $invoice) {
                    return $this->transformInvoice($invoice);
                })->all();

        if ($recordsPerPage > 0) {
            $paginatedResults = $this->invoiceRepository->paginateArrayResults($invoices, $recordsPerPage);
            return $paginatedResults->toJson();
        }
        
        return collect($invoices)->toJson();
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

        if (is_array($arrLines) && !empty($arrLines)) {
            foreach ($arrLines as $arrLine) {
                $this->invoiceLineRepository->createInvoiceLine($invoice, $arrLine);
            }
        }

        $invoice = $this->transformInvoice($invoice);
        return $invoice->toJson();
    }

    /**
     * 
     * @param int $customer_id
     * @return type
     */
    public function show(int $invoice_id) {

        $lines = $this->invoiceRepository->getInvoiceLinesByInvoiceId($invoice_id);
        $invoice = $this->invoiceRepository->findInvoiceById($invoice_id);

        $arrTest = [
            'lines' => $lines,
            'invoice' => $invoice
        ];

        return collect($arrTest)->toJson();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroyLine(int $id) {
        $customer = $this->invoiceLineRepository->findLineById($id);
        $customerRepo = new InvoiceLineRepository($customer);
        $customerRepo->deleteLine();
    }

    /**
     * 
     * @param int $id
     * @param Request $request
     */
    public function updateLine(int $id, Request $request) {

        $invoiceLine = $this->invoiceLineRepository->findLineById($id);

        $update = new InvoiceLineRepository($invoiceLine);

        $update->updateLine($request->all());
    }

    /**
     * 
     * @param int $id
     * @param Request $request
     */
    public function update(int $id, Request $request) {

        $invoice = $this->invoiceRepository->findInvoiceById($id);

        $update = new InvoiceRepository($invoice);

        $update->updateInvoice($request->all());
    }

}
