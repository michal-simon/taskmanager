<?php

namespace App\Repositories;

use App\InvoiceLine;
use App\Invoice;
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;
use App\Repositories\Base\BaseRepository;

class InvoiceLineRepository extends BaseRepository implements InvoiceLineRepositoryInterface {

    /**
     * InvoiceLineRepository constructor.
     * @param Order $invoiceLine
     */
    public function __construct(InvoiceLine $invoiceLine) {
        parent::__construct($invoiceLine);
        $this->model = $invoiceLine;
    }

    /**
     * Create the invoice line
     * @param Invoice $invoice
     * @param array $params
     * @return InvoiceLine
     */
    public function createInvoiceLine(Invoice $invoice, array $params): InvoiceLine {
        try {

            $params['invoice_id'] = $invoice->id;

            $invoiceLine = $this->create($params);
            return $invoiceLine;
        } catch (QueryException $e) {
            return false;
        }
    }

    /**
     * Find the invoice line or fail
     *
     * @param int $id
     *
     * @return InvoiceLine
     * @throws \Exception
     */
    public function findLineById(int $id): InvoiceLine {
        return $this->findOneOrFail($id);
    }

    /**
     * Delete a invoice line
     *
     * @return bool
     * @throws \Exception
     */
    public function deleteLine(): bool {
        return $this->delete();
    }

}
