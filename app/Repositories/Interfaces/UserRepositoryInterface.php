<?php
namespace App\Repositories\Interfaces;

use App\User;
use Illuminate\Support\Collection;
use App\Repositories\Base\BaseRepositoryInterface;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    //public function getAll(string $orderBy, string $orderDir, int $recordsPerPage, $blActive = true);
    public function listUsers($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Collection;
    public function deleteUser() : bool;
    public function updateUser(array $data) : bool;
    public function findUserById(int $id) : User;
    public function createUser(array $data) : User;
}