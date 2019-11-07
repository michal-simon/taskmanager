<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\User;
use App\Task;
use App\Customer;

class Event extends Authenticatable {

    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'beginDate',
        'endDate',
        'customer_id',
        'location',
        'event_type',
        'description',
        'created_by'
    ];
    
    private $repository =  'App\Repositories\EventRepository';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users() {
        return $this->belongsToMany(User::class);
    }

    public function tasks() {
        return $this->belongsToMany(Task::class);
    }

    public function customer() {
        return $this->belongsTo(Customer::class);
    }
    
    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }
}
