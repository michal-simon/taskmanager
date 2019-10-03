<?php

namespace App\Transformations;

use App\User;
use App\Repositories\DepartmentRepository;
use App\Department;

trait UserTransformable {

    /**
     * Transform the user
     *
     * @param User $user
     * @return User
     */
    protected function transformUser(User $user) {
        $prop = new User;

        $prop->id = (int) $user->id;
        $prop->first_name = $user->first_name;
        $prop->last_name = $user->last_name;
        $prop->email = $user->email;
        $prop->username = $user->username;
        $prop->department = $user->departments()->pluck('department_id')->all();
        $prop->dept = '';

        if ($user->departments->count() > 0) {
            $objDepartment = $user->departments->first();
            $prop->dept = $objDepartment->name;
        }

        return $prop;
    }

}
