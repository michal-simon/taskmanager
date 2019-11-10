<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\InvoiceLineRepository;
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;
use App\Transformations\InvoiceTransformable;
use App\Repositories\TaskRepository;
use App\Task;

class InvoiceLineController extends Controller {

    use InvoiceTransformable;

    private $invoiceLineRepository;

    public function __construct(InvoiceRepositoryInterface $invoiceRepository, InvoiceLineRepositoryInterface $invoiceLineRepository) {
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceLineRepository = $invoiceLineRepository;
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
     * @param int $task_id
     * @return type
     */
    public function getInvoiceLinesForTask(int $task_id, int $finance_type) {
        $task = (new TaskRepository(new Task))->findTaskById($task_id);
        $invoice = $this->invoiceRepository->getInvoiceForTask($task, $finance_type);

        if (!$invoice->count()) {
            return response()->json('empty');
        }

        $lines = $this->invoiceLineRepository->getInvoiceLinesForTask($task, $finance_type);

        $arrTest = [
            'lines' => $lines,
            'invoice' => $invoice[0]
        ];

        return response()->json($arrTest);
    }

}
