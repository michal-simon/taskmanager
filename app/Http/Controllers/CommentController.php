<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Comment;
use App\Http\Requests\CommentRequest;
use App\Repositories\Interfaces\CommentRepositoryInterface;
use App\Repositories\Interfaces\TaskRepositoryInterface;

class CommentController extends Controller
{
    private $commentRepository;
    private $taskRepository;

    public function __construct(CommentRepositoryInterface $commentRepository, TaskRepositoryInterface $taskRepository)
    {
        $this->commentRepository = $commentRepository;
        $this->taskRepository = $taskRepository;
    }

    public function index($task_id) {

        $objTask = $this->taskRepository->findTaskById($task_id);
        $comments = $this->commentRepository->getAllCommentsForTask($objTask);
        return $comments->toJson();
    }

    public function store(CommentRequest $request) {

        $validatedData = $request->validated();

        $this->commentRepository->createComment([
            'task_id' => $validatedData['task_id'],
            'comment' => $validatedData['comment'],
            'user_id' => $validatedData['user_id']
        ]);

        $objTask = $this->taskRepository->findTaskById($request['task_id']);
        $comments = $this->commentRepository->getAllCommentsForTask($objTask);
        return $comments->toJson();
    }
}
