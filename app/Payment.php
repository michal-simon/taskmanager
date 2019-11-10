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
        'payment_type_id',
        'amount',
        'customer_id',
        'invoice_id'
    ];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
