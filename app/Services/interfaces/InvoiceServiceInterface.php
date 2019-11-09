<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Services\Interfaces;

use App\Requests\SearchRequest;
use Illuminate\Http\Request;

/**
 * Description of InvoiceServiceInterface
 *
 * @author michael.hampton
 */
interface InvoiceServiceInterface {

    /**
     * 
     * @param SearchRequest $request
     */
    public function search(SearchRequest $request);

    /**
     * 
     * @param Request $request
     */
    public function create(Request $request);

    /**
     * 
     * @param int $id
     * @param Request $request
     */
    public function update(int $id, Request $request);
}
