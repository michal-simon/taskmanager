<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Project;

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
        'created_by',
        'task_type'
    ];
    
    public function projects() {
        return $this->belongsTo(Project::class);
    }
}
