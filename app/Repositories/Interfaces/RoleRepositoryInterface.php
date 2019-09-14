<?php
namespace App\Repositories\Interfaces;

use App\Role;
use Illuminate\Support\Collection;

interface RoleRepositoryInterface
{
    public function listRoles($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Collection;
}