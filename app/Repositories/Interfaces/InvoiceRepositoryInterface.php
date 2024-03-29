<?php
namespace App\Repositories\Interfaces;

use App\Invoice;
use App\Task;
use Illuminate\Support\Collection;

interface InvoiceRepositoryInterface
{
     /**
     * 
     * @param string $order
     * @param string $sort
     * @param array $columns
     */
    public function listInvoices(string $order = 'id', string $sort = 'desc', array $columns = ['*']): Collection;

    /**
     * 
     * @param array $params
     */
    public function createInvoice(array $params): Invoice;

    /**
     * 
     * @param array $params
     */
    public function updateInvoice(array $params): bool;

    /**
     * 
     * @param int $id
     */
    public function findInvoiceById(int $id): Invoice;
    
    /**
     * 
     * @param \App\Repositories\Interfaces\Task $objTask
     */
    public function getInvoiceForTask(Task $objTask, int $finance_type): Collection;
    
    public function deleteInvoice(): bool;
  
}