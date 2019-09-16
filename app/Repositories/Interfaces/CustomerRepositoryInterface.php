<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Repositories\Interfaces;

use App\Repositories\Base\BaseRepositoryInterface;
use App\Customer;
use Illuminate\Support\Collection as Support;

/**
 *
 * @author michael.hampton
 */
interface CustomerRepositoryInterface extends BaseRepositoryInterface {

    public function listCustomers(string $order = 'id', string $sort = 'desc', array $columns = ['*']): Support;

    public function createCustomer(array $params): Customer;

    public function updateCustomer(array $params): bool;

    public function findCustomerById(int $id): Customer;

    public function deleteCustomer(): bool;

}
