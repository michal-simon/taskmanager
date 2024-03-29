<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;
use App\Transformations\InvoiceTransformable;
use App\Invoice;
use App\Services\Interfaces\PaymentServiceInterface;
use App\Requests\SearchRequest;
use App\Services\Interfaces\InvoiceServiceInterface;
use Illuminate\Support\Facades\Mail;

class InvoiceController extends Controller {

    use InvoiceTransformable;

    private $invoiceRepository;
    private $invoiceLineRepository;
    private $invoiceService;
    private $paymentService;

    public function __construct(InvoiceRepositoryInterface $invoiceRepository, InvoiceLineRepositoryInterface $invoiceLineRepository, InvoiceServiceInterface $invoiceService, PaymentServiceInterface $paymentService) {
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceLineRepository = $invoiceLineRepository;
        $this->invoiceService = $invoiceService;
        $this->paymentService = $paymentService;
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

        if ($request->has('send_to_customer') && $request->send_to_customer == 1) {
            $invoice = $this->invoiceRepository->findInvoiceById($id);
            $this->invoiceService->saveInvitations($invoice);
            //
//                    Mail::to($invoice->customer)
//            ->send(new \App\Mail\SendInvoiceEmail($invoice));  
        }

        if ($request->has('create_payment') && $request->create_payment == 1) {
            $invoice = $this->invoiceRepository->findInvoiceById($id);
            $payment = $this->paymentService->autoBillInvoice($invoice);
            return response()->json($payment);
        }

        $invoice = $this->invoiceService->update($id, $request);

        $invoiceTransformed = $this->transformInvoice($invoice);
        return $invoiceTransformed->toJson();
    }

    /**
     * 
     * @param string $filter
     * @param int $id
     * @return type
     */
    public function filterInvoices(Request $request) {
        $list = $this->invoiceRepository->filterInvoices($request->all());
        $invoices = $list->map(function (Invoice $invoice) {
                    return $this->transformInvoice($invoice);
                })->all();

        return response()->json($invoices);
    }

}
