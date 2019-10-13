<?php

namespace App;

use App/Task;
use Illuminate\Database\Eloquent\Model;

class TaskStatus extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 
        'description', 
        'icon',
        'color',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
