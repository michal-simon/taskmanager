<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use App\Requests\CreateTaskRequest;
use App\Requests\UpdateTaskRequest;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\TaskRepository;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Product;
use App\Repositories\ProductRepository;

class TaskController extends Controller {

    private $taskRepository;
    private $projectRepository;

    /**
     * 
     * @param TaskRepositoryInterface $taskRepository
     * @param ProjectRepositoryInterface $projectRepository
     */
    public function __construct(TaskRepositoryInterface $taskRepository, ProjectRepositoryInterface $projectRepository) {
        $this->taskRepository = $taskRepository;
        $this->projectRepository = $projectRepository;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(CreateTaskRequest $request) {
        
        $validatedData = $request->except('project_id');

        if (!empty($validatedData['project_id'])) {
            $objProject = $this->projectRepository->findProjectById($validatedData['project_id']);
        }
        
        $validatedData['customer_id'] = empty($validatedData['customer_id']) && isset($objProject) ? $objProject->customer_id : $validatedData['customer_id'];

        $task = $this->taskRepository->createTask($validatedData);

        if ($validatedData['task_type'] == 1) {
            $objProject->tasks()->attach($task);
        }

        return $task->toJson();
    }

    /**
     * 
     * @param Task $task
     * @return type
     */
    public function markAsCompleted(Task $task) {
        $objTask = $this->taskRepository->findTaskById($id);
        $taskRepo = new TaskRepository($objTask);
        $taskRepo->updateTask(['is_completed' => true]);
        return response()->json('Task updated!');
    }

    public function getTasksForProject($projectId) {
        $objProject = $this->projectRepository->findProjectById($projectId);
        $task = $this->taskRepository->getTasksForProject($objProject);
        return $task->toJson();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $objTask = $this->taskRepository->findTaskById($id);
        $taskRepo = new TaskRepository($objTask);
        $taskRepo->deleteTask();
        return response()->json('Task deleted!');
    }

    /**
     * @param UpdateTaskRequest $request
     * @param int $id
     *
     * @return Response
     */
    public function update(UpdateTaskRequest $request, int $id) {
        $task = $this->taskRepository->findTaskById($id);
        $taskRepo = new TaskRepository($task);
        $taskRepo->updateTask($request->all());
    }

    public function getLeads() {
        $tasks = $this->taskRepository->getLeads(2);
        return $tasks->toJson();
    }

    public function getDeals() {
        $tasks = $this->taskRepository->getLeads(3);
        return $tasks->toJson();
    }

    /**
     * 
     * @param Request $request
     * @param int $id
     */
    public function updateStatus(Request $request, int $id) {
        $task = $this->taskRepository->findTaskById($id);
        $taskRepo = new TaskRepository($task);
        $taskRepo->updateTask(['task_status' => $request->task_status]);
    }

    /**
     * 
     * @param Request $request
     * @param int $task_type
     */
    public function filterTasks(Request $request, int $task_type) {

        $tasks = $this->taskRepository->filterTasks($request->all(), $task_type);

        return $tasks->toJson();
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

        $task = $this->taskRepository->findTaskById($task_id);

        $taskRepo = new TaskRepository($task);

        if ($request->has('products')) {
            $taskRepo->syncProducts($request->input('products'));
        }

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

}
