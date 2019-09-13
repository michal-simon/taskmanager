<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App;

use App\Province;
use App\State;
use Illuminate\Database\Eloquent\Model;
/**
 * Description of Country
 *
 * @author michael.hampton
 */
use App\Shop\Provinces\Province;
use App\Shop\States\State;
use Illuminate\Database\Eloquent\Model;

class Country extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'iso',
        'iso3',
        'numcode',
        'phonecode',
        'status'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function provinces() {
        return $this->hasMany(Province::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function states() {
        return $this->hasMany(State::class);
    }

}
