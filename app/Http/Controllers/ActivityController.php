<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Requests\CommentRequest;
use App\Repositories\Interfaces\CommentRepositoryInterface;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\UserRepository;
use App\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\CommentCreated;

class ActivityController extends Controller {

    /**
     * @var CommentRepositoryInterface
     */
    private $commentRepository;

    /**
     * @var TaskRepositoryInterface
     */
    private $taskRepository;

    /**
     * CommentController constructor.
     *
     * @param CommentRepositoryInterface $commentRepository
     * TaskRepositoryInterface $taskRepository
     */
    public function __construct(CommentRepositoryInterface $commentRepository, TaskRepositoryInterface $taskRepository) {
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
        
        //send notification
        $user = auth()->guard('user')->user();
        Notification::send($user, new CommentCreated($comment));

        return collect($arrResponse)->toJson();
    }
    
    public function getCommentsForMessageBoard() {  
        $comments = $this->commentRepository->listComments();
        return response()->json($comments);
    }

}
