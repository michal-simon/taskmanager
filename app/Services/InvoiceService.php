<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Services;

use App\Services\Interfaces\InvoiceServiceInterface;
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

/**
 * Description of InvoiceService
 *
 * @author michael.hampton
 */
class InvoiceService implements InvoiceServiceInterface {

    use InvoiceTransformable;

    private $invoiceLineRepository;
    private $entityManager;

    public function __construct(InvoiceRepositoryInterface $invoiceRepository, InvoiceLineRepositoryInterface $invoiceLineRepository) {
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceLineRepository = $invoiceLineRepository;
        $this->entityManager = new EntityManager();
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function search(SearchRequest $request) {

        $orderBy = !$request->column ? 'due_date' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;

        if (request()->has('search_term') && !empty($request->search_term)) {
            return $this->invoiceRepository->searchInvoice(request()->input('search_term'));
        }
        return $this->invoiceRepository->listInvoices($orderBy, $orderDir, ['*']);
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function create(Request $request) {
        
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
        $user = $currentUser = Auth::user();
        Notification::send($user, new InvoiceCreated($invoice));
        
        return $invoice;
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
                    'sub_total' => $arrLine['sub_total'],
                    'tax_total' => $arrLine['tax_total'],
                    'unit_tax' => $arrLine['unit_tax'],
                    'unit_discount' => $arrLine['unit_discount'],
                    'quantity' => $arrLine['quantity'],
                    'unit_price' => $arrLine['unit_price'],
                    'product_id' => $arrLine['product_id']
                ]);
            }
        }

        return $invoice;
    }

}
