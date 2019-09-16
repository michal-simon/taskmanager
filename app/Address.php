<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Description of Address
 *
 * @author michael.hampton
 */
class Address extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public $fillable = [
        'alias',
        'address_1',
        'address_2',
        'zip',
        'city',
        'state_code',
        'province_id',
        'country_id',
        'customer_id',
        'status',
        'phone'
    ];

}
