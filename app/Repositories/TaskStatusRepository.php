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
     * Create the order status
     *
     * @param array $params
     * @return OrderStatus
     * @throws OrderStatusInvalidArgumentException
     */
    public function createTaskStatus(array $params) : OrderStatus
    {
         return $this->create($params);
    }

    /**
     * Update the order status
     *
     * @param array $data
     *
     * @return bool
     * @throws OrderStatusInvalidArgumentException
     */
    public function updateTaskStatus(array $data) : bool
    {
        return $this->update($data);
    }

    /**
     * @param int $id
     * @return OrderStatus
     * @throws OrderStatusNotFoundException
     */
    public function findTaskStatusById(int $id) : OrderStatus
    {
        return $this->findOneOrFail($id);
    }

    /**
     * @return mixed
     */
    public function listOrderStatuses()
    {
        return $this->all();
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteOrderStatus() : bool
    {
        return $this->delete();
    }

    /**
     * @return Collection
     */
    public function findTasks() : Collection
    {
        return $this->model->tasks()->get();
    }

    /**
     * @param string $name
     *
     * @return mixed
     */
    public function findByName(string $name)
    {
        return $this->model->where('name', $name)->first();
    }

}
