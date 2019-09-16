<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Task;

class Project extends Model
{
    protected $fillable = [
        'title', 
        'description', 
        'created_by', 
        'customer_id'
    ];

   /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function tasks()
    {
        return $this->belongsToMany(Task::class);
    }
}
