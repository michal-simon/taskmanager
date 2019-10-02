<?php
namespace App\Transformations;

use App\User;
use App\Repositories\UserRepository;
use App\Customer;

trait UserTransformable
{
    /**
     * Transform the user
     *
     * @param User $user
     * @return User
     */
    protected function transformUser(User $user)
    {
        $prop = new User;
        
        $prop->id = (int) $user->id;
        $prop->first_name = $user->first_name;
        $prop->last_name = $user->last_name;
        $prop->email = $user->email;
        $prop->username = $user->username;
        $prop->department = $user->departments()->pluck('department_id')->all();
        
        return $prop;
    }
}