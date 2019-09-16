<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Repositories\Interfaces;

use App\Repositories\Base\BaseRepositoryInterface;
use Illuminate\Support\Collection;

/**
 *
 * @author michael.hampton
 */
interface AddressRepositoryInterface extends BaseRepositoryInterface {

    /**
     * 
     * @param array $update
     */
    public function updateAddress(array $update): bool;

    /**
     * 
     */
    public function deleteAddress();

    /**
     * 
     * @param string $order
     * @param string $sort
     * @param array $columns
     */
    public function listAddress(string $order = 'id', string $sort = 'desc', array $columns = ['*']): Collection;
}
