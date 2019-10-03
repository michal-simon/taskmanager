<?php

namespace App;

use App\Product;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model {

    protected $fillable = [
        'name',
        'website',
        'phone_number',
        'email',
        'address_1',
        'address_2',
        'town',
        'city',
        'postcode'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products() {
        return $this->hasMany(Product::class);
    }

}
