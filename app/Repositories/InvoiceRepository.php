<?php

namespace App\Repositories;

use App\Invoice;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use Illuminate\Support\Collection;

class InvoiceRepository extends BaseRepository implements InvoiceRepositoryInterface {

    /**
     * InvoiceRepository constructor.
     * @param Order $invoice
     */
    public function __construct(Invoice $invoice) {
        parent::__construct($invoice);
        $this->model = $invoice;
    }

    /**
     * Create the invoice
     *
     * @param array $params
     * @return Invoice
     */
    public function createInvoice(array $params): Invoice {
        try {
            $invoice = $this->create($params);
            return $invoice;
        } catch (QueryException $e) {
            return false;
        }
    }

    /**
     * @param int $id
     *
     * @return Invoice
     * @throws \Exception
     */
    public function findInvoiceById(int $id): Invoice {
        return $this->findOneOrFail($id);
    }

    /**
     * 
     * @param int $customerId
     * @return type
     */
    public function getInvoicesByIdWithLines(int $invoiceId) {
        return Invoice::join('invoice_lines', 'invoice_lines.invoice_id', '=', 'invoices.id')
                        ->select('invoice_lines.*')
                        ->where('invoices.id', $invoiceId)
                        ->get();
    }

    /**
     * List all the invoices
     *
     * @param string $order
     * @param string $sort
     * @param array $columns
     * @return \Illuminate\Support\Collection
     */
    public function listInvoices(string $order = 'id', string $sort = 'desc', array $columns = ['*']): Collection {
        return $this->all($columns, $order, $sort);
    }

    /**
     * Update the invoice
     *
     * @param array $data
     *
     * @return bool
     */
    public function updateInvoice(array $data): bool {
        return $this->update($data);
    }

}
