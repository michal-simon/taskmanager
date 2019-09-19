<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\TaskStatusRepositoryInterface;

class TaskStatusController extends Controller
{
   private $taskStatusRepository;

    public function __construct(TaskStatusRepositoryInterface $taskStatusRepository)
    {
        $this->taskStatusRepository = $taskStatusRepository;
    }

    public function index(int $task_type)
    {
        $statuses = $this->taskStatusRepository->getAllStatusForTaskType($task_type);

        return $statuses->toJson();
    }
}
