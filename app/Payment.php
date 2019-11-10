<?php
namespace App;
use Illuminate\Database\Eloquent\Model;
class Payment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'customer_id',
        'payment_type',
        'discount_total',
        'tax_total',
        'total'
    ];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
