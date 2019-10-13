<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\TaskStatusRepositoryInterface;

class TaskStatusController extends Controller
{
   private $taskStatusRepository;

    public function __construct(TaskStatusRepositoryInterface $taskStatusRepository)
    {
        $this->taskStatusRepository = $taskStatusRepository;
    }

    public function index(int $task_type)
    {
        $statuses = $this->taskStatusRepository->getAllStatusForTaskType($task_type);

        return $statuses->toJson();
    }

     /**
     * Store a newly created resource in storage.
     *
     * @param  CreateTaskStatusRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateTaskStatusRequest $request)
    {
        $status = $this->taskStatuses->createTaskStatus($request->except('_token', '_method'));
    }

    
    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateTaskStatusRequest $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTaskStatusRequest $request, int $id)
    {
        $taskStatus = $this->taskStatuses->findTaskStatusById($id);
        $update = new TaskStatusRepository($taskStatus);
        $update->updateTaskStatus($request->all());
    }

     /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id)
    {
        $this->taskStatuses->findTaskStatusById($id)->delete();
    }
}
