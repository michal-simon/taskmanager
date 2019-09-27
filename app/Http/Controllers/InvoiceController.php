<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\InvoiceRepository;
use App\Repositories\InvoiceLineRepository;
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;
use App\Transformations\InvoiceTransformable;
use App\Invoice;
use App\Repositories\TaskRepository;
use App\Task;
use Illuminate\Support\Facades\Notification;
use App\Notifications\InvoiceCreated;

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

        if (!empty($request->invoice_id)) {
            $invoice = $this->invoiceRepository->findInvoiceById($request->invoice_id);
            $invoiceRepo = new InvoiceRepository($invoice);
            $invoiceRepo->updateInvoice($request->all());
        } else {
            $invoice = $this->invoiceRepository->createInvoice($request->all());
            $invoiceRepo = new InvoiceRepository($invoice);
        }

        if ($request->has('task_id') && !empty($request->task_id)) {
            $invoiceRepo->syncTasks($request->input('task_id'));
        }

        if (is_array($arrLines) && !empty($arrLines)) {
            foreach ($arrLines as $arrLine) {
                $this->invoiceLineRepository->createInvoiceLine($invoice, $arrLine);
            }
        }
        
        //send notification
        $user = auth()->guard('user')->user();
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

    /**
     * 
     * @param int $task_id
     * @return type
     */
    public function getInvoiceLinesForTask(int $task_id) {

        $task = (new TaskRepository(new Task))->findTaskById($task_id);
        $invoice = $this->invoiceRepository->getInvoiceForTask($task);
        $lines = $this->invoiceLineRepository->getInvoiceLinesForTask($task);
        
        $arrTest = [
            'lines' => $lines,
            'invoice' => $invoice[0]
        ];

        return response()->json($arrTest);
    }

}
