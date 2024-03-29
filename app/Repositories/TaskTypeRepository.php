<?php
namespace App\Repositories;
use App\TaskType;
use App\Repositories\Interfaces\TaskTypeRepositoryInterface;
use App\Repositories\Base\BaseRepository;

class TaskTypeRepository extends BaseRepository implements TaskTypeRepositoryInterface {
    
    /**
     * TaskTypeRepository constructor.
     *
     * @param TaskType $taskType
     */
    public function __construct(TaskType $taskType) {
        parent::__construct($taskType);
        $this->model = $taskType;
    }
    public function getAll() {
        return $this->model->orderBy('name', 'asc')
                        ->get();
    }
    
    /**
     * @param int $id
     *
     * @return TaskType
     * @throws \Exception
     */
    public function findTaskTypeById(int $id): TaskType {
        return $this->findOneOrFail($id);
    }
}
