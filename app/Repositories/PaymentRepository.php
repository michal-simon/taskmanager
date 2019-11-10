<?php
namespace App\Repositories;
use App\Repositories\Base\BaseRepository;
use App\Payment;
use App\Repositories\Interfaces\PaymentRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
class PaymentRepository extends BaseRepository implements PaymentRepositoryInterface
{
    /**
     * PaymentRepository constructor.
     * @param Payment $payment
     */
    public function __construct(Payment $payment)
    {
        parent::__construct($payment);
        $this->model = $payment;
    }
    /**
     * Create the payment
     *
     * @param array $params
     * @return Payment
     * @throws CourierInvalidArgumentException
     */
    public function createPayment(array $params) : Payment
    {
       
        return $this->create($params);
    }
    /**
     * Update the courier
     *
     * @param array $params
     *
     * @return bool
     * @throws CourierInvalidArgumentException
     */
    public function updatePayment(array $params) : bool
    {
       
        return $this->update($params);
       
        
    }
    /**
     * Return the payment
     *
     * @param int $id
     *
     * @return Courier
     * @throws CourierNotFoundException
     */
    public function findPaymentById(int $id) : Payment
    {
        
        return $this->findOneOrFail($id);
       
        
    }
    /**
     * Return all the couriers
     *
     * @param string $order
     * @param string $sort
     * @return Collection|mixed
     */
    public function listPayments(string $order = 'id', string $sort = 'desc') : Collection
    {
        return $this->all(['*'], $order, $sort);
    }
    /**
     * @return bool
     * @throws \Exception
     */
    public function deletePayment()
    {
        return $this->delete();
    }
}
