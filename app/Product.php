<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use App\Traits\SearchableTrait;

class Product extends Model {

    use SearchableTrait;

    /**
     * Searchable rules.
     *
     * @var array
     */
    protected $searchable = [
        'columns' => [
            'products.name' => 10,
            'products.description' => 5,
            'products.sku' => 5
        ]
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'sku',
        'name',
        'description',
        'price',
        'status',
        'sale_price',
        'slug',
    ];

   /**
     * @param $term
     *
     * @return mixed
     */
    public function searchProduct($term)
    {
        return self::search($term);
    }

}
