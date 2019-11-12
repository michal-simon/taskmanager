<?php
namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\SearchableTrait;

class TaxRate extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'rate'
    ];
    
     protected $searchable = [
        'columns' => [
            'tax_rates.name' => 10
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
    public function searchTaxRate($term) {
        return self::search($term);
    }
}
