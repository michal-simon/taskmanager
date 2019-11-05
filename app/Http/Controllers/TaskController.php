<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use App\Requests\CreateTaskRequest;
use App\Requests\CreateDealRequest;
use App\Requests\UpdateTaskRequest;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\TaskRepository;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Product;
use App\Repositories\ProductRepository;
use App\Repositories\CustomerRepository;
use App\Customer;
use Illuminate\Support\Facades\Auth;
use App\Transformations\TaskTransformable;
use App\Repositories\SourceTypeRepository;
use App\SourceType;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskCreated;
use App\Services\TaskService;

class TaskController extends Controller {

    use TaskTransformable;

    /**
     * @var TaskRepositoryInterface
     */
    private $taskRepository;

    /**
     * @var ProjectRepositoryInterface
     */
    private $projectRepository;

    /**
     * 
     * @param TaskRepositoryInterface $taskRepository
     * @param ProjectRepositoryInterface $projectRepository
     */
    public function __construct(TaskRepositoryInterface $taskRepository, ProjectRepositoryInterface $projectRepository, TaskService $taskService) {
        $this->taskRepository = $taskRepository;
        $this->projectRepository = $projectRepository;
        $this->taskService = $taskService;
    }

    public function index() {
        $tasks = $this->taskService->search();
        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(CreateTaskRequest $request) {
        $task = $this->taskService->create($request);
        return response()->json($this->transformTask($task));
    }

    /**
     * 
     * @param int $task_id
     * @return type
     */
    public function markAsCompleted(int $task_id) {
        $products = $this->taskService->markAsCompleted($task_id);
        return response()->json('Task updated!');
    }

    /**
     * 
     * @param int $projectId
     * @return type
     */
    public function getTasksForProject(int $projectId) {
        $objProject = $this->projectRepository->findProjectById($projectId);
        $list = $this->taskRepository->getTasksForProject($objProject);

        $tasks = $list->map(function (Task $task) {
                    return $this->transformTask($task);
                })->all();

        return response()->json($tasks);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $response = $this->taskService->delete($id);
        
        if($response) {
            return response()->json('Task deleted!');
        }
       
        return response()->json('Unable to delete task!');
    }

    /**
     * @param UpdateTaskRequest $request
     * @param int $id
     *
     * @return Response
     */
    public function update(UpdateTaskRequest $request, int $id) {
        $response = $this->taskService->update($request, $id);
        
        if($response) {
            return response()->json('Updated task successfully');
        }
        
        return response()->json('unable to update task');
    }

    public function getLeads() {
        $list = $this->taskRepository->getLeads();

        $tasks = $list->map(function (Task $task) {
                    return $this->transformTask($task);
                })->all();

        return response()->json($tasks);
    }

    public function getDeals() {
        $list = $this->taskRepository->getDeals();

        $tasks = $list->map(function (Task $task) {
                    return $this->transformTask($task);
                })->all();

        return response()->json($tasks);
    }

    /**
     * 
     * @param Request $request
     * @param int $id
     */
    public function updateStatus(Request $request, int $id) {
         $products = $this->taskService->updateStatus($request, $id);
    }

    /**
     * 
     * @param Request $request
     * @param int $task_type
     */
    public function filterTasks(Request $request, int $task_type) {
        $list = $this->taskRepository->filterTasks($request->all(), $task_type);

        $tasks = $list->map(function (Task $task) {
                    return $this->transformTask($task);
                })->all();

        return response()->json($tasks);
    }

    public function getTasksWithProducts() {
        $tasks = $this->taskRepository->getTasksWithProducts();
        return $tasks->toJson();
    }

    /**
     * 
     * @param int $task_id
     * @param Request $request
     */
    public function addProducts(int $task_id, Request $request) {
         $products = $this->taskService->addProducts($task_id, $request);
        return response()->json('added products to task successfully');
    }

    /**
     * 
     * @param int $task_id
     * @return type
     */
    public function getProducts(int $task_id) {

        $products = (new ProductRepository(new Product))->listProducts();
        $task = $this->taskRepository->findTaskById($task_id);

        $arrData = [
            'products' => $products,
            'selectedIds' => $task->products()->pluck('product_id')->all(),
        ];

        return response()->json($arrData);
    }

    /**
     * 
     * @param CreateDealRequest $request
     * @return type
     */
    public function createDeal(Request $request) {
        $products = $this->taskService->createDeal($request);
        return response()->json($task);
    }

    /**
     * 
     * @param int $parent_id
     * @return type
     */
    public function getSubtasks(int $parent_id) {

        $task = $this->taskRepository->findTaskById($parent_id);
        $subtasks = $this->taskRepository->getSubtasks($task);

        $tasks = $subtasks->map(function (Task $task) {
                    return $this->transformTask($task);
                })->all();
        return response()->json($tasks);
    }

    public function getSourceTypes() {
        $sourceTypes = (new SourceTypeRepository(new SourceType))->getAll();
        return response()->json($sourceTypes);
    }

    public function getTaskTypes() {
        $taskTypes = (new TaskTypeRepository(new TaskType))->getAll();
        return response()->json($taskTypes);
    }

}
