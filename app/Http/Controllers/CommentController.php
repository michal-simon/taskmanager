<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Http\Requests\CommentRequest;
use App\Repositories\Interfaces\CommentRepositoryInterface;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\UserRepository;
use App\User;

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
         $objUser = (new UserRepository(new User))->findUserById($request->user_id);

        $comment = $this->commentRepository->createComment([
            'task_id' => $validatedData['task_id'],
            'comment' => $validatedData['comment'],
            'user_id' => $validatedData['user_id']
        ]);

        $arrResponse[0] = $comment;
        $arrResponse[0]['user'] = $objUser->toArray();

       return collect($arrResponse)->toJson();
    }
}
