<?php
namespace App\Repositories\Interfaces;

use App\Task;
use App\Project;
use Illuminate\Support\Collection;

interface TaskRepositoryInterface
{
    public function createTask(array $data) : Task;
    public function findTaskById(int $id) : Task;
    public function updateTask(array $data) : bool;
    public function deleteTask() : bool;
    public function listTasks($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Collection;
    public function getTasksForProject(Project $objProject);
}