<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\TaskStatusRepositoryInterface;
use App\Repositories\TaskStatusRepository;
use App\Requests\CreateTaskStatusRequest;
use App\Requests\UpdateTaskStatusRequest;
use Illuminate\Http\Request;

class TaskStatusController extends Controller {

    private $taskStatusRepository;

    public function __construct(TaskStatusRepositoryInterface $taskStatusRepository) {
        $this->taskStatusRepository = $taskStatusRepository;
    }

    public function index(int $task_type) {
        $statuses = $this->taskStatusRepository->getAllStatusForTaskType($task_type);

        return $statuses->toJson();
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function search(Request $request) {

        $orderBy = !$request->column ? 'title' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;

        $statuses = $this->taskStatusRepository->listTaskStatuses($orderBy, $orderDir);

        if ($recordsPerPage > 0) {
            $paginatedResults = $this->taskStatusRepository->paginateArrayResults($statuses->toArray(), $recordsPerPage);
            return $paginatedResults->toJson();
        }

        return response()->json($statuses);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateTaskStatusRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateTaskStatusRequest $request) {
        $status = $this->taskStatusRepository->createTaskStatus($request->except('_token', '_method'));
        return response()->json($status);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateTaskStatusRequest $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTaskStatusRequest $request, int $id) {
        $status = $this->taskStatusRepository->findTaskStatusById($id);
        $update = new TaskStatusRepository($status);
        $update->updateTaskStatus($request->all());
        return response()->json($status);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id) {
        $this->taskStatusRepository->findTaskStatusById($id)->delete();
    }

}
