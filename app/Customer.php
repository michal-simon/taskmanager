<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\SearchableTrait;

class Customer extends Model {

    use SearchableTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'status'
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
        ]
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function addresses() {
        return $this->hasMany(Address::class)->whereStatus(true);
    }

    /**
     * @param $term
     *
     * @return mixed
     */
    public function searchCustomer($term)
    {
        return self::search($term);
    }
}
