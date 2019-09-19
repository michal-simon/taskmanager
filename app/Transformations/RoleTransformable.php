<?php

namespace App\Transformations;

use App\Role;

trait RoleTransformable {

    protected function transformRole(Role $role) {
        $prop = new Role;

        $prop->id = (int) $role->id;
        $prop->name = $role->name;
        $prop->description = $role->description;
        
        return $prop;
    }

}
