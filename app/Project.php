<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title', 
        'description', 
        'created_by', 
        'customer_id'
    ];

    public function tasks() {
        return $this->hasMany(Task::class);
    }
}
