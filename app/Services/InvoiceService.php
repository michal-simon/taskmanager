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
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;
use App\Transformations\InvoiceTransformable;
use Illuminate\Support\Facades\Notification;
use App\Notifications\InvoiceCreated;
use Illuminate\Support\Facades\Auth;
use App\Requests\SearchRequest;
use App\Invoice;
use App\Invitation;

/**
 * Description of InvoiceService
 *
 * @author michael.hampton
 */
class InvoiceService implements InvoiceServiceInterface {

    use InvoiceTransformable;

    private $invoiceRepository;
    private $invoiceLineRepository;
    private $entityManager;

    /**
     *
     * @var bool 
     */
    private $auto_convert_quote = false;

    /**
     *
     * @var bool 
     */
    private $auto_archive_quote = true;

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
        $invoiceRepo = $this->entityManager::getRepository($invoice);

        if ($request->has('task_id') && !empty($request->task_id)) {
            $invoiceRepo->syncTasks($request->input('task_id'));
        }

        if (is_array($arrLines) && !empty($arrLines)) {
            foreach ($arrLines as $arrLine) {
                $this->invoiceLineRepository->createInvoiceLine($invoice, $arrLine);
            }
        }

        /* if ($invoice->is_recurring) {
            if (! $isNew && isset($data['start_date']) && $invoice->start_date && $invoice->start_date != Utils::toSqlDate($data['start_date'])) {
                $invoice->last_sent_date = null;
            }
            $invoice->frequency_id = array_get($data, 'frequency_id', FREQUENCY_MONTHLY);
            $invoice->start_date = Utils::toSqlDate(array_get($data, 'start_date'));
            $invoice->end_date = Utils::toSqlDate(array_get($data, 'end_date'));
            $invoice->client_enable_auto_bill = isset($data['client_enable_auto_bill']) && $data['client_enable_auto_bill'] ? true : false;
            $invoice->auto_bill = array_get($data, 'auto_bill_id') ?: array_get($data, 'auto_bill', AUTO_BILL_OFF);
            if ($invoice->auto_bill < AUTO_BILL_OFF || $invoice->auto_bill > AUTO_BILL_ALWAYS) {
                $invoice->auto_bill = AUTO_BILL_OFF;
            }
            if (isset($data['recurring_due_date'])) {
                $invoice->due_date = $data['recurring_due_date'];
            } elseif (isset($data['due_date'])) {
                $invoice->due_date = $data['due_date'];
            }
        } */

//send notification
        $user = $currentUser = Auth::user();
        Notification::send($user, new InvoiceCreated($invoice));

        return $invoice;
    }

    public function saveInvitations(Invoice $invoice) {
        $client = $invoice->customer;
        $sendInvoiceIds = [];

        if (!$client->count()) {
            return $invoice;
        }

//         foreach ($client->contacts as $contact) {
//            if ($contact->send_invoice) {
//                $sendInvoiceIds[] = $contact->id;
//            }
//        }


        $sendInvoiceIds[] = $client->id;

        $invitation = Invitation::where('customer_id', $client->id)->where('invoice_id', $invoice->id)->first();

        if (in_array($client->id, $sendInvoiceIds) && !$invitation) {
            $invitation = new Invitation();
            $invitation->invoice_id = $invoice->id;
            $invitation->customer_id = $client->id;
            $invitation->invitation_key = strtolower(str_random(22));
            $invitation->save();
        } elseif (!in_array($client->id, $sendInvoiceIds) && $invitation) {
            $invitation->delete();
        }

        if (!$invoice->areInvitationsSent()) {
            $invoice->markInvitationsSent();
        }
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

        $invoiceRepo = $this->entityManager::getRepository($invoice);
        $invoiceRepo->updateInvoice($request->all());

        if ($request->has('task_id') && !empty($request->task_id)) {
            $invoiceRepo->syncTasks($request->input('task_id'));
        }

        $this->invoiceLineRepository->deleteAllLines($invoice);

        if (is_array($arrLines) && !empty($arrLines)) {
            foreach ($arrLines as $arrLine) {
                $this->saveInvoiceLines($arrLine);
            }
        }

        return $invoice;
    }

    /**
     * 
     * @param array $arrLine
     * @return boolean
     */
    private function saveInvoiceLines(array $arrLine, Invoice $invoice) {
        $this->invoiceLineRepository->createInvoiceLine($invoice, [
            'sub_total' => $arrLine['sub_total'],
            'tax_total' => $arrLine['tax_total'],
            'unit_tax' => $arrLine['unit_tax'],
            'unit_discount' => $arrLine['unit_discount'],
            'quantity' => $arrLine['quantity'],
            'unit_price' => $arrLine['unit_price'],
            'product_id' => $arrLine['product_id']
        ]);

        return true;
    }

    /**
     * @param $quote
     * @param Invitation|null $invitation
     *
     * @return mixed|null
     */
    public function approveQuote(Invoice $quote) {

        //event(new QuoteInvitationWasApproved($quote, $quote->customer_id));

        if ($this->auto_convert_quote) {
            return $this->convertQuote($quote);
        }

        return $quote->markApproved();
    }

    /**
     * @param $quote
     * @param Invitation|null $invitation
     *
     * @return mixed
     */
    public function convertQuote(Invoice $quote) {
        $arrLines = $this->invoiceLineRepository->getInvoiceLinesByInvoiceId($quote)->toArray();

        $invoice = $this->invoiceRepository->createInvoice(
                [
                    'customer_id' => $quote->customer_id,
                    'payment_type' => $quote->payment_type,
                    'total' => $quote->total,
                    'invoice_status' => 1,
                    'due_date' => $quote->due_date,
                    'finance_type' => 1,
                    'sub_total' => $quote->sub_total,
                    'tax_total' => $quote->tax_total,
                    'discount_total' => $quote->discount_total,
                    'parent_id' => $quote->id
                ]
        );

        if (is_array($arrLines) && !empty($arrLines)) {
            foreach ($arrLines as $arrLine) {
                $this->saveInvoiceLines($arrLine, $invoice);
            }
        }

        if ($quote->tasks()->count() > 0) {
            //$invoiceRepo = $this->entityManager::getRepository($invoice);
            $ids = $quote->tasks->pluck('id')->toArray();
            $invoice->tasks()->sync($ids);
        }

        if ($this->auto_archive_quote) {
            $invoiceRepo = $this->entityManager::getRepository($quote);
            $invoiceRepo->delete();
        }

        return $invoice;
    }

}
