<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\SearchableTrait;

class Invoice extends Model {

    use SearchableTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'customer_id',
        'total',
        'payment_type',
        'due_date',
        'invoice_status'
    ];

    /**
     * Searchable rules.
     *
     * @var array
     */
    protected $searchable = [
        /**
         * Columns and their priority in search results.
         * Columns with higher values are more important.
         * Columns with equal values have equal importance.
         *
         * @var array
         */
        'columns' => [
            'customers.first_name' => 10,
            'customers.last_name' => 10,
            'customers.email' => 5,
        ],
        'joins' => [
            'customers' => ['invoices.customer_id', 'customers.id'],
        ],
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

    /**
     * @param $term
     *
     * @return mixed
     */
    public function searchInvoice($term) {
        return self::search($term);
    }

}