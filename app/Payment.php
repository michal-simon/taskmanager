<?php
namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\SearchableTrait;

class Payment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'payment_type_id',
        'amount',
        'customer_id',
        'invoice_id'
    ];
    
     protected $searchable = [
        'columns' => [
            'payments.name' => 10
        ]
    ];
    
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
    
    /**
     * @param $term
     *
     * @return mixed
     */
    public function searchPayment($term) {
        return self::search($term);
    }
}
