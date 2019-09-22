<?php

namespace App\Repositories;

use App\Task;
use App\Project;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use App\Exceptions\CreateTaskErrorException;
use Illuminate\Support\Collection as Support;
use Illuminate\Database\Eloquent\Collection;

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
    public function listTasks($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc'): Support {
        return $this->all($columns, $orderBy, $sortBy);
    }

    /**
     * 
     * @param Project $objProject
     * @return type
     */
    public function getTasksForProject(Project $objProject): Support {

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
    public function getLeads(): Support {
        return Task::where('task_type', 2)
                        ->where('is_completed', 0)
                        ->get();
    }

    /**
     * @param string $text
     * @return mixed
     */
    public function searchTask(string $text = null): Collection {
        if (is_null($text)) {
            return $this->all();
        }
        return $this->model->searchTask($text)->get();
    }

    /**
     * 
     * @param array $arrFilters
     * @param type $task_type
     * @param Project $objProject
     * @return Support
     */
    public function filterTasks(array $arrFilters, $task_type, Project $objProject = null): Support {

        if ($task_type === 1) {
            $query = Task::join('project_task', 'tasks.id', '=', 'project_task.task_id')
                    ->select('tasks.id as id', 'tasks.*')
                    ->where('project_id', $objProject->id)
                    ->where('is_completed', 0);
        } else {
            $query = Task::where('is_completed', 0)
                    ->where('task_type', 2);
        }


        foreach ($arrFilters as $arrFilter) {
            $query->where($arrFilter['column'], '=', $arrFilter['value']);
        }

        return $query->get();
    }

}
