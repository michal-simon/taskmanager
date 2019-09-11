<?php
namespace App\Repositories;

use App\TaskStatus;
use App\Repositories\Interfaces\TaskStatusRepositoryInterface;

class TaskStatusRepository implements TaskStatusRepositoryInterface
{
    public function getAll()
    {        
        return TaskStatus::where('is_active', 1)
                            ->orderBy('id', 'asc')
                            ->get();
    }
}