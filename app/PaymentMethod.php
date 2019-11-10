<?php

namespace App;

use App\Invoice;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'payment_type_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function invoices() {
        return $this->hasMany(Invoice::class);
    }
    
     /**
     * @return bool
     */
    public function requiresDelayedAutoBill()
    {
        return $this->payment_type_id === 2;
    }

}
