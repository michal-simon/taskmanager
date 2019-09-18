<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Repositories;

use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use App\Customer;
use Illuminate\Support\Collection as Support;
use Illuminate\Database\Eloquent\Collection;


/**
 * Description of CustomerRepository
 *
 * @author michael.hampton
 */
class CustomerRepository extends BaseRepository implements CustomerRepositoryInterface {

    /**
     * CustomerRepository constructor.
     * @param Customer $customer
     */
    public function __construct(Customer $customer) {
        parent::__construct($customer);
        $this->model = $customer;
    }

    /**
     * List all the employees
     *
     * @param string $order
     * @param string $sort
     * @param array $columns
     * @return \Illuminate\Support\Collection
     */
    public function listCustomers(string $order = 'id', string $sort = 'desc', array $columns = ['*']): Support {
        return $this->all($columns, $order, $sort);
    }

    /**
     * Find the customer or fail
     *
     * @param int $id
     *
     * @return Customer
     * @throws CustomerNotFoundException
     */
    public function findCustomerById(int $id): Customer {
        return $this->findOneOrFail($id);
    }

    /**
     * Create the customer
     *
     * @param array $params
     * @return Customer
     * @throws CreateCustomerInvalidArgumentException
     */
    public function createCustomer(array $params): Customer {
        return $this->create($params);
    }

    /**
     * Delete a customer
     *
     * @return bool
     * @throws \Exception
     */
    public function deleteCustomer(): bool {
        return $this->delete();
    }

    /**
     * Update the customer
     *
     * @param array $params
     *
     * @return bool
     * @throws UpdateCustomerInvalidArgumentException
     */
    public function updateCustomer(array $params): bool {
        return $this->model->update($params);
    }

    /**
     * @param string $text
     * @return mixed
     */
    public function searchCustomer(string $text = null) : Collection
    {
        if (is_null($text)) {
            return $this->all();
        }
        return $this->model->searchCustomer($text)->get();
    }
}
