<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\RoleRepositoryInterface;

class RoleController extends Controller
{
    private $roleRepository;

    public function __construct(RoleRepositoryInterface $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function index() {
        $roles = $this->roleRepository->listRoles();
        return $roles->toJson();
    }

}