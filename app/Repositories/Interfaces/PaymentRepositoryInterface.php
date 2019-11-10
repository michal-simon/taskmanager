<?php
namespace App\Repositories\Interfaces;
use App\Repositories\Base\BaseRepositoryInterface;
use App\Payment;
use Illuminate\Support\Collection;
interface PaymentRepositoryInterface extends BaseRepositoryInterface
{
    public function createPayment(array $data) : Payment;
    public function updatePayment(array $params) : bool;
    public function findPaymentById(int $id) : Payment;
    public function listPayments(string $order = 'id', string $sort = 'desc') : Collection;
    public function deletePayment();
}
