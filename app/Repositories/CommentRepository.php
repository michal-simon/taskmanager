<?php

namespace App\Repositories;

use App\Comment;
use App\Task;
use App\Repositories\Interfaces\CommentRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use App\Exceptions\CreateCommentErrorException;
use Illuminate\Support\Collection;

class CommentRepository extends BaseRepository implements CommentRepositoryInterface {

    /**
     * CommentRepository constructor.
     *
     * @param Comment $comment
     */
    public function __construct(Comment $comment) {
        parent::__construct($comment);
        $this->model = $comment;
    }

    /**
     * @param array $data
     * @param int $id
     *
     * @return bool
     * @throws \Exception
     */
    public function updateComment(array $data): bool {
        return $this->update($data);
    }

    /**
     * @param array $data
     *
     * @return Comment
     * @throws CreateCommentErrorException
     */
    public function createComment(array $data): Comment {
        try {
            return $this->create($data);
        } catch (QueryException $e) {
            throw new CreateCommentErrorException($e);
        }
    }

    /**
     * @param int $id
     *
     * @return Comment
     * @throws \Exception
     */
    public function findCommentById(int $id): Comment {
        return $this->findOneOrFail($id);
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteComment(): bool {
        return $this->delete();
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     *
     * @return Collection
     */
    public function listComments($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc'): Collection {
        return $this->all($columns, $orderBy, $sortBy);
    }

    public function getAllCommentsForTask(Task $objTask) : Collection {
        return $this->model->join('task_comment', 'comments.id', '=', 'task_comment.comment_id')
                        ->where('task_comment.task_id', $objTask->id)
                        ->orderBy('created_at', 'desc')
                        ->with('user')
                        ->get();
    }

    /**
     * 
     * @return Collection
     */
    public function getCommentsForActivityFeed() : Collection {
        return $this->model->where('task_id', 0)
                        ->orderBy('created_at', 'desc')
                        ->with('user')
                        ->get();
    }

}
