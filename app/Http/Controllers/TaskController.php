<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use App\Http\Requests\TaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\TaskRepository;
use App\Repositories\Interfaces\ProjectRepositoryInterface;

class TaskController extends Controller {

    private $taskRepository;
    private $projectRepository;

    public function __construct(TaskRepositoryInterface $taskRepository, ProjectRepositoryInterface $projectRepository) {
        $this->taskRepository = $taskRepository;
        $this->projectRepository = $projectRepository;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(TaskRequest $request) {
        $validatedData = $request->validated();
        $task = $this->taskRepository->createTask([
            'task_type' => $validatedData['task_type'],
            'title' => $validatedData['title'],
            'content' => $validatedData['content'],
            'task_color' => $validatedData['task_color'],
            'contributors' => $validatedData['contributors'],
            'due_date' => $validatedData['due_date'],
            'task_status' => $validatedData['task_status'],
            'created_by' => $validatedData['created_by'],
        ]);
        if ($validatedData['task_type'] == 1) {
            $objProject = $this->projectRepository->findProjectById($validatedData['project_id']);
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
        $tasks = $this->taskRepository->getLeads();
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

}
