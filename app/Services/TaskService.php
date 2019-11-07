<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Task;
use App\Requests\CreateTaskRequest;
use App\Requests\CreateDealRequest;
use App\Requests\UpdateTaskRequest;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Repositories\CustomerRepository;
use App\Customer;
use Illuminate\Support\Facades\Auth;
use App\Transformations\TaskTransformable;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskCreated;
use App\Services\Interfaces\TaskServiceInterface;
use App\Services\EntityManager;

class TaskService implements TaskServiceInterface {

    use TaskTransformable;

     private $entityManager;
    
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
        $this->entityManager = new EntityManager();
    }

    public function search() {
        $list = $this->taskRepository->listTasks();
        $tasks = $list->map(function (Task $task) {
                    return $this->transformTask($task);
                })->all();
        return $tasks;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function create(CreateTaskRequest $request) {
        $validatedData = $request->except('project_id', 'contributors');
        $currentUser = Auth::user();
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
            $taskRepo = $this->entityManager::getRepository($task);
            //$taskRepo = new TaskRepository($task);
            $taskRepo->syncUsers($request->input('contributors'));
        }
        //send notification
        Notification::send($currentUser, new TaskCreated($task));
        return $task;
    }

    /**
     * 
     * @param int $task_id
     * @return type
     */
    public function markAsCompleted(int $task_id) {
        $objTask = $this->taskRepository->findTaskById($task_id);
        $taskRepo = $this->entityManager::getRepository($objTask);
        //$taskRepo = new TaskRepository($objTask);
        $taskRepo->updateTask(['is_completed' => true]);
        return true;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function delete($id) {
        $objTask = $this->taskRepository->findTaskById($id);
        
        //$taskRepo = new TaskRepository($objTask);
        $taskRepo = $this->entityManager::getRepository($objTask);
        $taskRepo->syncUsers([]);
        $taskRepo->deleteTask();
        return true;
    }

    /**
     * @param UpdateTaskRequest $request
     * @param int $id
     *
     * @return Response
     */
    public function update(UpdateTaskRequest $request, int $id) {
        $task = $this->taskRepository->findTaskById($id);
        //$taskRepo = new TaskRepository($task);
        $taskRepo = $this->entityManager::getRepository($task);
        $taskRepo->updateTask($request->except('contributors'));
        if ($request->has('contributors')) {
            $taskRepo->syncUsers($request->input('contributors'));
        }

        return true;
    }

    /**
     * 
     * @param Request $request
     * @param int $id
     */
    public function updateStatus(Request $request, int $id) {
        $task = $this->taskRepository->findTaskById($id);
        //$taskRepo = new TaskRepository($task);
        $taskRepo = $this->entityManager::getRepository($task);
        $taskRepo->updateTask(['task_status' => $request->task_status]);
    }

    /**
     * 
     * @param CreateDealRequest $request
     * @return type
     */
    public function createDeal(Request $request) {
        $currentUser = Auth::user();
        $userId = !$currentUser ? 9874 : $currentUser->id;
        $request->customer_type = 2;
        $customer = (new CustomerRepository(new Customer))->createCustomer($request->except('_token', '_method', 'valued_at', 'title', 'description'));
        if ($request->has('address_1') && !empty($request->address_1)) {
            $customer->addresses()->create([
                'company_id' => $request->company_id,
                'job_title' => $request->job_title,
                'address_1' => $request->address_1,
                'address_2' => $request->address_2,
                'zip' => $request->zip,
                'city' => $request->city,
                'country_id' => 225,
                'status' => 1
            ]);
        }
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
           // $taskRepo = new TaskRepository($task);
            $taskRepo = $this->entityManager::getRepository($task);
            $taskRepo->syncUsers($request->input('contributors'));
        }

        return $task;
    }

    /**
     * 
     * @param int $task_id
     * @param Request $request
     */
    public function addProducts(int $task_id, Request $request) {
        $task = $this->taskRepository->findTaskById($task_id);
        $taskRepo = $this->entityManager::getRepository($task);
        //$taskRepo = new TaskRepository($task);
        if ($request->has('products')) {
            $taskRepo->buildOrderDetails($request->input('products'));
        }
        return response()->json('added products to task successfully');
    }

}
