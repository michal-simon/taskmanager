<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title', 
        'project_id', 
        'content', 
        'task_color', 
        'contributors', 
        'due_date', 
        'task_status', 
        'created_by'
    ];
}
