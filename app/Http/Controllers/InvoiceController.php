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
        $arrLines = json_decode($request->data, true);
        
        $invoice = $this->invoiceRepository->createInvoice($request->all());
        $invoiceRepo = new InvoiceRepository($invoice);

        if ($request->has('task_id') && !empty($request->task_id)) {
            $invoiceRepo->syncTasks($request->input('task_id'));
        }

        if (is_array($arrLines) && !empty($arrLines)) {
            foreach ($arrLines as $arrLine) {
                $this->invoiceLineRepository->createInvoiceLine($invoice, $arrLine);
            }
        }

        //send notification
        $user =  $currentUser =  $user = Auth::user();
        Notification::send($user, new InvoiceCreated($invoice));

        $invoice = $this->transformInvoice($invoice);
        return $invoice->toJson();
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
        $arrLines = json_decode($request->data, true);    
        $invoice = $this->invoiceRepository->findInvoiceById($request->invoice_id);

        $invoiceRepo = new InvoiceRepository($invoice);
        $invoiceRepo->updateInvoice($request->all());

        if ($request->has('task_id') && !empty($request->task_id)) {
            $invoiceRepo->syncTasks($request->input('task_id'));
        }

        $this->invoiceLineRepository->deleteAllLines($invoice);

        if (is_array($arrLines) && !empty($arrLines)) {
            foreach ($arrLines as $arrLine) {

                $this->invoiceLineRepository->createInvoiceLine($invoice, [
                    'quantity' => $arrLine['quantity'],
                    'description' => $arrLine['description'],
                    'unit_price' => $arrLine['unit_price'],
                    'product_id' => $arrLine['product_id']
                ]);
            }
        }

        $invoice = $this->transformInvoice($invoice);
        return $invoice->toJson();
    }

}
