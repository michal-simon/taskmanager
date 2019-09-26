<?php

namespace App\Repositories;

use App\Invoice;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use Illuminate\Support\Collection;
use App\Task;

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

    /**
     * @param string $text
     * @return mixed
     */
    public function searchInvoice(string $text = null): Collection {
        if (is_null($text)) {
            return $this->all();
        }
        return $this->model->searchInvoice($text)->get();
    }

    /**
     * Sync the tasks
     *
     * @param array $params
     */
    public function syncTasks(int $task_id) {
        $this->model->tasks()->sync($task_id);
    }

    /**
     * 
     * @param int $customerId
     * @return type
     */
    public function getInvoiceForTask(Task $objTask): Collection {

        return $this->model->join('invoice_task', 'invoice_task.invoice_id', '=', 'invoices.id')
                        ->select('invoices.*')
                        ->where('invoice_task.task_id', $objTask->id)
                        ->get();
    }

}
