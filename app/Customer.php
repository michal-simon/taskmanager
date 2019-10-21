<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\SearchableTrait;
use App\Message;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Brand;
use App\CustomerType;

class Customer extends Model {

    use SearchableTrait,
        SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'status',
        'job_title',
        'company_id',
        'phone',
        'customer_type'
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
    
    public function company() {
        return $this->belongsTo(Brand::class, 'company_id');
    }
    
    public function customerType() {
        return $this->belongsTo(CustomerType::class, 'customer_type');
    }

    /**
     * @param $term
     *
     * @return mixed
     */
    public function searchCustomer($term) {
        return self::search($term);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function messages() {
        return $this->belongsToMany(Message::class);
    }

}
