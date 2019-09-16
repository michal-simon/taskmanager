<?php

namespace App\Repositories;

use App\Task;
use App\Project;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use App\Exceptions\CreateTaskErrorException;
use Illuminate\Support\Collection;

class TaskRepository extends BaseRepository implements TaskRepositoryInterface {

    /**
     * TaskRepository constructor.
     *
     * @param Task $task
     */
    public function __construct(Task $task) {
        parent::__construct($task);
        $this->model = $task;
    }

    /**
     * @param array $data
     *
     * @return Task
     * @throws CreateProjectErrorException
     */
    public function createTask(array $data): Task {
        try {
            return $this->create($data);
        } catch (QueryException $e) {
            throw new CreateTaskErrorException($e);
        }
    }

    /**
     * @param int $id
     *
     * @return Task
     * @throws \Exception
     */
    public function findTaskById(int $id): Task {
        return $this->findOneOrFail($id);
    }

    /**
     * @param array $data
     * @param int $id
     *
     * @return bool
     * @throws \Exception
     */
    public function updateTask(array $data): bool {
        return $this->update($data);
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteTask(): bool {
        return $this->delete();
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     *
     * @return Collection
     */
    public function listTasks($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc'): Collection {
        return $this->all($columns, $orderBy, $sortBy);
    }

    /**
     * 
     * @param Project $objProject
     * @return type
     */
    public function getTasksForProject(Project $objProject) {

        return Task::join('project_task', 'tasks.id', '=', 'project_task.task_id')
                        ->select('tasks.id as id', 'tasks.*')
                        ->where('project_id', $objProject->id)
                        ->where('is_completed', 0)
                        ->get();
    }

    /**
     * 
     * @return type
     */
    public function getLeads() {
        return Task::where('task_type', 2)
                        ->where('is_completed', 0)
                        ->get();
    }

}
