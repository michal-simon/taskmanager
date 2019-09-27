<?php

namespace App\Transformations;

use App\Task;
use App\User;
use App\Repositories\UserRepository;
use App\Repositories\TaskStatusRepository;
use App\TaskStatus;

trait TaskTransformable {

    protected function transformTask(Task $task) {

        $objUser = (new UserRepository(new User))->findUserById($task->contributors);
        $objStatus = (new TaskStatusRepository(new TaskStatus))->findStatusById($task->task_status);

        $prop = new Task;
        $prop->id = (int) $task->id;
        $prop->title = $task->title;
        $prop->content = $task->content;
        $prop->name = $objUser->first_name . ' ' . $objUser->last_name;
        $prop->due_date = $task->due_date;
        $prop->task_color = $task->task_color;
        $prop->is_completed = $task->is_completed;
        $prop->task_status = $task->task_status;
        $prop->status_name = $objStatus->title;
        $prop->task_type = $task->task_type;
        $prop->rating = $task->rating;
        $prop->customer_id = $task->customer_id;
        $prop->valued_at = $task->valued_at;
        $prop->is_active = $task->is_active;
        
        return $prop;
    }

}
