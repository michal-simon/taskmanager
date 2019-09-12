<?php
namespace App\Repositories\Interfaces;

use App\File;
use App\Task;
use Illuminate\Support\Collection;

interface FileRepositoryInterface
{
    public function getFilesForTask(Task $objTask);
    public function createFile(array $data) : File;
    public function findFileById(int $id) : File;
    public function deleteFile() : bool;
    public function listFiles($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Collection;   
}