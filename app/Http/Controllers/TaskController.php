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
use App\Repositories\CategoryRepository;
use App\Category;
use App\Repositories\CustomerRepository;
use App\Customer;
use App\Transformations\TaskTransformable;
use App\Repositories\SourceTypeRepository;
use App\SourceType;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskCreated;

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
    public function __construct(TaskRepositoryInterface $taskRepository, ProjectRepositoryInterface $projectRepository) {
        $this->taskRepository = $taskRepository;
        $this->projectRepository = $projectRepository;
    }

    public function index() {
        $list = $this->taskRepository->listTasks();

        $tasks = $list->map(function (Task $task) {
                    return $this->transformTask($task);
                })->all();

        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(CreateTaskRequest $request) {
        $validatedData = $request->except('project_id', 'contributors');
        $currentUser = auth()->guard('user')->user();

        if (!empty($request->project_id)) {
            $objProject = $this->projectRepository->findProjectById($request->project_id);
        }

        $validatedData['customer_id'] = empty($validatedData['customer_id']) && isset($objProject) ? $objProject->customer_id : $validatedData['customer_id'];
        $validatedData['source_type'] = empty($validatedData['source_type']) ? 1 : $validatedData['source_type'];
        $validatedData['created_by'] = $currentUser->id;

        $task = $this->taskRepository->createTask($validatedData);

        if ($validatedData['task_type'] == 1) {
            $objProject->tasks()->attach($task);
        }

        if ($request->has('contributors')) {
            $taskRepo = new TaskRepository($task);
            $taskRepo->syncUsers($request->input('contributors'));
        }

        //send notification
        Notification::send($currentUser, new TaskCreated($task));

        return response()->json($this->transformTask($task));
    }

    /**
     * 
     * @param int $task_id
     * @return type
     */
    public function markAsCompleted(int $task_id) {
        $objTask = $this->taskRepository->findTaskById($task_id);
        $taskRepo = new TaskRepository($objTask);
        $taskRepo->updateTask(['is_completed' => true]);
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
        $taskRepo->updateTask($request->except('contributors'));

        if ($request->has('contributors')) {
            $taskRepo->syncUsers($request->input('contributors'));
        }

        return response()->json('Updated task successfully');
    }

    public function getLeads() {
        $list = $this->taskRepository->getLeads(2);

        $tasks = $list->map(function (Task $task) {
                    return $this->transformTask($task);
                })->all();

        return response()->json($tasks);
    }

    public function getDeals() {
        $list = $this->taskRepository->getLeads(3);

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

    /**
     * 
     * @param CreateDealRequest $request
     * @return type
     */
    public function createDeal(Request $request) {
        $currentUser = auth()->guard('user')->user();
        $userId = !$currentUser ? 9874 : $currentUser->id;

        $customer = (new CustomerRepository(new Customer))->createCustomer($request->except('_token', '_method', 'valued_at', 'title', 'description'));

        $customer->addresses()->create([
            'company_name' => $request->company_name,
            'job_title' => $request->job_title,
            'phone' => $request->phone,
            'address_1' => $request->address_1,
            'address_2' => $request->address_2,
            'zip' => $request->zip,
            'city' => $request->city,
            'country_id' => 225,
            'status' => 1
        ]);

        $task = $this->taskRepository->createTask(
                [
                    'created_by' => $userId,
                    'source_type' => $request->source_type,
                    'title' => $request->title,
                    'description' => $request->description,
                    'customer_id' => $customer->id,
                    'valued_at' => $request->valued_at,
                    'task_type' => $request->task_type,
                    'task_status' => $request->task_status
                ]
        );

        if ($request->has('contributors')) {
            $taskRepo = new TaskRepository($task);
            $taskRepo->syncUsers($request->input('contributors'));
        }

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

}
