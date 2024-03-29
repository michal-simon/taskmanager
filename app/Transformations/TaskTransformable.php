<?php

namespace App\Transformations;

use App\Task;
use App\User;
use App\Repositories\UserRepository;
use App\Repositories\TaskStatusRepository;
use App\TaskStatus;
use App\Transformations\CustomerTransformable;

trait TaskTransformable {
    
    use CustomerTransformable;

    protected function transformTask(Task $task) {
        
        $prop = new Task;
        $prop->id = (int) $task->id;
        $prop->title = $task->title;
        $prop->content = $task->content;
        $prop->comments = $task->comments;
        $prop->due_date = $task->due_date;
        $prop->start_date = $task->start_date;
        $prop->is_completed = $task->is_completed;
        $prop->task_status = $task->task_status;
        $prop->status_name = $task->taskStatus->title;
        $prop->task_type = $task->task_type;
        $prop->rating = $task->rating;
        $prop->customer = $this->transformCustomer($task->customer);
        $prop->customer_id = $task->customer_id;
        $prop->valued_at = $task->valued_at;
        $prop->source_type = $task->source_type;
        $prop->users = $task->users;
        $prop->contributors = $task->users()->pluck('user_id')->all();
        $prop->is_active = $task->is_active;

        return $prop;
    }

}
