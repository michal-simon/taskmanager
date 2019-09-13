<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App;

use App\Customer;
use App\Province;
use Illuminate\Database\Eloquent\Model;
use App\City;
use App\Country;

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

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
//    protected $hidden = [];
//    protected $dates = ['deleted_at'];
//
//    public function customer() {
//        return $this->belongsTo(Customer::class);
//    }
//
//    public function country() {
//        return $this->belongsTo(Country::class);
//    }
//
//    public function province() {
//        return $this->belongsTo(Province::class);
//    }
//
//    /**
//     * @deprecated
//     *
//     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
//     */
//    public function city() {
//        return $this->belongsTo(City::class, 'city');
//    }

}
