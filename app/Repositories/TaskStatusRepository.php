<?php

namespace App\Repositories;

use App\TaskStatus;
use App\Repositories\Interfaces\TaskStatusRepositoryInterface;

class TaskStatusRepository implements TaskStatusRepositoryInterface {

    public function getAll() {
        return TaskStatus::where('is_active', 1)
                        ->orderBy('id', 'asc')
                        ->get();
    }

    public function getAllStatusForTaskType(int $task_type) {
        return TaskStatus::where('is_active', 1)
                        ->where('task_type', $task_type)
                        ->orderBy('id', 'asc')
                        ->get();
    }

}
