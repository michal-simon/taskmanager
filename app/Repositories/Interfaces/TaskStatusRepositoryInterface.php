<?php
namespace App\Repositories\Interfaces;

use App\TaskStatus;

interface TaskStatusRepositoryInterface
{
    public function getAll();

    /**
     * 
     * @param int $task_type
     */
    public function getAllStatusForTaskType(int $task_type);
    
    /**
     * 
     * @param int $id
     */
    public function findStatusById(int $id): TaskStatus;
}