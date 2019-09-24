<?php
namespace App\Repositories\Interfaces;

use App\Task;
use App\Project;
use Illuminate\Support\Collection as Support;
use Illuminate\Database\Eloquent\Collection;
use App\Repositories\Base\BaseRepositoryInterface;

interface TaskRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * 
     * @param array $data
     */
    public function createTask(array $data) : Task;
    
    /**
     * 
     * @param int $id
     */
    public function findTaskById(int $id) : Task;
    
    /**
     * 
     * @param array $data
     */
    public function updateTask(array $data) : bool;
    
    /**
     * 
     */
    public function deleteTask() : bool;
    
    /**
     * 
     * @param type $columns
     * @param string $orderBy
     * @param string $sortBy
     */
    public function listTasks($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Support;

    /**
     * 
     * @param array $arrData
     * @param type $task_type
     */
    public function filterTasks(array $arrData, $task_type) : Support;
    
    /**
     * 
     * @param string $text
     */
    public function searchTask(string $text = null) : Collection;
    
    /**
     * 
     * @param int $task_type
     */
    public function getLeads(int $task_type) : Support;
    
    /**
     * 
     * @param Project $objProject
     */
    public function getTasksForProject(Project $objProject) : Support;
}