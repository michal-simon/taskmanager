<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\InvoiceRepository;
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;
use App\Transformations\InvoiceTransformable;
use App\Invoice;
use Illuminate\Support\Facades\Notification;
use App\Notifications\InvoiceCreated;
use Illuminate\Support\Facades\Auth;
use App\Requests\SearchRequest;
use App\Services\Interfaces\InvoiceServiceInterface;

class InvoiceController extends Controller {

    use InvoiceTransformable;

    private $invoiceLineRepository;
    private $invoiceService;

    public function __construct(InvoiceRepositoryInterface $invoiceRepository, InvoiceLineRepositoryInterface $invoiceLineRepository, InvoiceServiceInterface $invoiceService) {
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceLineRepository = $invoiceLineRepository;
        $this->invoiceService = $invoiceService;
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function index(SearchRequest $request) {
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;
        $list = $this->invoiceService->search($request);
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
        $invoice = $this->invoiceService->create($request);
        $invoiceTransformed = $this->transformInvoice($invoice);
        return $invoiceTransformed->toJson();
    }

    /**
     * 
     * @param int $customer_id
     * @return type
     */
    public function show(int $invoice_id) {

        $invoice = $this->invoiceRepository->findInvoiceById($invoice_id);
        $lines = $this->invoiceLineRepository->getInvoiceLinesByInvoiceId($invoice);

        $arrTest = [
            'lines' => $lines,
            'invoice' => $invoice
        ];

        return response()->json($arrTest);
    }

    /**
     * 
     * @param int $id
     * @param Request $request
     */
    public function update(int $id, Request $request) {
        $invoice = $this->invoiceService->update($id, $request);
        $invoiceTransformed = $this->transformInvoice($invoice);
        return $invoiceTransformed->toJson();
    }

}
