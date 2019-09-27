<?php

namespace App\Repositories;

use App\TaskStatus;
use App\Repositories\Interfaces\TaskStatusRepositoryInterface;
use App\Repositories\Base\BaseRepository;

class TaskStatusRepository extends BaseRepository implements TaskStatusRepositoryInterface {
    
     /**
     * TaskStatusRepository constructor.
     *
     * @param TaskStatus $taskStatus
     */
    public function __construct(TaskStatus $taskStatus) {
        parent::__construct($taskStatus);
        $this->model = $taskStatus;
    }

    public function getAll() {
        return $this->model->where('is_active', 1)
                        ->orderBy('id', 'asc')
                        ->get();
    }

    /**
     * 
     * @param int $task_type
     * @return type
     */
    public function getAllStatusForTaskType(int $task_type) {
        return $this->model->where('is_active', 1)
                        ->where('task_type', $task_type)
                        ->orderBy('id', 'asc')
                        ->get();
    }
    
    /**
     * @param int $id
     *
     * @return TaskStatus
     * @throws \Exception
     */
    public function findStatusById(int $id): TaskStatus {
        return $this->findOneOrFail($id);
    }

}
