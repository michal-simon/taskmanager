<?php
namespace App\Repositories\Interfaces;

use App\Comment;
use App\Task;
use Illuminate\Support\Collection;

interface CommentRepositoryInterface
{
    public function getAllCommentsForTask(Task $objTask);
    public function createComment(array $data) : Comment;
    public function findCommentById(int $id) : Comment;
    public function deleteComment() : bool;
    public function listComments($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Collection;
}