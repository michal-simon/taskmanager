<?php

namespace App;

use App\Product;
use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model {

    protected $fillable = [
        'range_from',
        'range_to',
        'monthly_price',
        'full_price',
        'interest_rate'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product() {
        return $this->belongsTo(Product::class);
    }

}
