<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'customer_id',
        'total',
        'payment_type'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function invoiceLines() {
        return $this->belongsToMany(InvoiceLine::class)
                        ->withPivot([
                            'quantity',
                            'description',
                            'unitPrice'
        ]);
    }

}
