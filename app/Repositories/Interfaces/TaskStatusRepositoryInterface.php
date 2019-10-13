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
    
    public function createOrderStatus(array $orderStatusData) : TaskStatus;
    public function updateOrderStatus(array $data) : bool;
    public function findOrderStatusById(int $id) : TaskStatus:
    public function listOrderStatuses();
    public function deleteOrderStatus() : bool;
    public function findOrders(): Collection;
    public function findByName(string $name);
}
