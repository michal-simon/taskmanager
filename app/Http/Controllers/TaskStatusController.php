<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Interfaces\TaskStatusRepositoryInterface;

class TaskStatusController extends Controller
{
   private $taskStatusRepository;

    public function __construct(TaskStatusRepositoryInterface $taskStatusRepository)
    {
        $this->taskStatusRepository = $taskStatusRepository;
    }

    public function index()
    {
        $statuses = $this->taskStatusRepository->getAll();

        return $statuses->toJson();
    }
}
