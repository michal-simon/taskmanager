<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Services;

use App\Services\Interfaces\PaymentServiceInterface;
use App\Requests\CreatePaymentRequest;
use App\Repositories\Interfaces\PaymentRepositoryInterface;
use App\Invoice;

/**
 * Description of PaymentService
 *
 * @author michael.hampton
 */
class PaymentService implements PaymentServiceInterface {

    private $entityManager;

    /**
     * @var ProductRepositoryInterface
     */
    private $paymentRepo;

    /**
     * 
     * @param PaymentRepositoryInterface $paymentRepository
     */
    public function __construct(PaymentRepositoryInterface $paymentRepository
    ) {
        $this->paymentRepo = $paymentRepository;
        $this->entityManager = new EntityManager();
    }

    /**
     * @param Invoice $invoice
     *
     * @return bool
     */
    public function autoBillInvoice(Invoice $invoice) {
        if (!$invoice->canBePaid()) {
            return false;
        }

        $client = $invoice->customer;

        $invoice->markSentIfUnsent();
        $credits = $client->credits;

        if ($credits - $invoice->total > 0) {
            $balance = $invoice->total;
            $amount = min($credits, $balance);
            $data = [
                'payment_type_id' => PAYMENT_TYPE_CREDIT,
                'invoice_id' => $invoice->id,
                'customer_id' => $client->id,
                'amount' => $amount,
            ];
            $payment = $this->paymentRepo->create($data);
            if ($amount == $balance) {
                return $payment;
            }
        }

        $paymentMethod = (new \App\PaymentMethod())->find(1);

        if ($paymentMethod->requiresDelayedAutoBill()) {

            $invoiceDate = \DateTime::createFromFormat('Y-m-d H:i:s', $invoice->created_at);

            $minDueDate = clone $invoiceDate;
            $minDueDate->modify('+10 days');

            if (date_create() < $minDueDate) {
                // Can't auto bill now
                return false;
            }

            if ($invoice->partial > 0) {
                // The amount would be different than the amount in the email
                return false;
            }

            if ($invoice->payments->count()) {
                // ACH requirements are strict; don't auto bill this
                return false;
            }
        }

        $data = [
            'payment_type_id' => 1,
            'invoice_id' => $invoice->id,
            'customer_id' => $client->id,
            'amount' => $invoice->total,
        ];

        $payment = $this->paymentRepo->create($data);

        return $payment;
    }

    public
            function create(CreatePaymentRequest $request, $payment = null, $invoice = null) {
        if ($invoice && Utils::parseFloat($input['amount']) > $invoice->balance) {
            $credit = Credit::createNew();
            $credit->client_id = $invoice->client_id;
            $credit->credit_date = date_create()->format('Y-m-d');
            $credit->amount = $credit->balance = $input['amount'] - $invoice->balance;
            $credit->private_notes = trans('texts.credit_created_by', ['transaction_reference' => isset($input['transaction_reference']) ? $input['transaction_reference'] : '']);
            $credit->save();
            $input['amount'] = $invoice->balance;
        }
        return $this->paymentRepo->save($input, $payment);
    }

}
