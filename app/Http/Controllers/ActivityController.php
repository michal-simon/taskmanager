<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\CommentRepositoryInterface;
use App\Repositories\Interfaces\NotificationRepositoryInterface;
use App\Notification;
use App\Transformations\NotificationTransformable;

class ActivityController extends Controller {
    
    use NotificationTransformable;

    /**
     * @var CommentRepositoryInterface
     */
    private $commentRepository;

    /**
     * @var TaskRepositoryInterface
     */
    private $notificationRepository;

    /**
     * ActivityController constructor.
     *
     * @param CommentRepositoryInterface $commentRepository
     * NotificationRepositoryInterface $notificationRepository
     */
    public function __construct(CommentRepositoryInterface $commentRepository, NotificationRepositoryInterface $notificationRepository) {
        $this->commentRepository = $commentRepository;
        $this->notificationRepository = $notificationRepository;
    }

    public function index() {
        $comments = $this->commentRepository->listComments();
        $list = $this->notificationRepository->listNotifications();

        $notifications = $list->map(function (Notification $notification) {
                    return $this->transformNotification($notification);
                })->all();

        return response()->json(
                        [
                            'notifications' => $notifications,
                            'comments' => $comments
                        ]
        );
    }

}
