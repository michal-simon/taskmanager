<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Task;
use App\User;

class Comment extends Model {

    protected $fillable = [
        'task_id',
        'comment',
        'user_id',
        'parent_id'
    ];

    public function task() {
        return $this->belongsTo('App\Task');
    }

    public function user() {
        return $this->belongsTo('App\User');
    }

}
