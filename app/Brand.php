<?php

namespace App;

use App\Product;
use Illuminate\Database\Eloquent\Model;
use App\Traits\SearchableTrait;

class Brand extends Model {

    use SearchableTrait;

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
    protected $searchable = [
        'columns' => [
            'brands.name' => 10
        ]
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products() {
        return $this->hasMany(Product::class);
    }

    /**
     * @param $term
     *
     * @return mixed
     */
    public function searchBrand($term) {
        return self::search($term);
    }

}
