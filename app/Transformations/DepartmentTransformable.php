<?php

namespace App\Transformations;

use App\Department;

trait DepartmentTransformable {

    /**
     * Transform the department
     *
     * @param Department $department
     * @return Department
     */
    protected function transformDepartment(Department $department) {
        $prop = new Department;

        $prop->id = (int) $department->id;
        $prop->name = $department->name;
        $prop->department_manager = $department->department_manager;

        return $prop;
    }

}
