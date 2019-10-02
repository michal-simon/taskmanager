<?php

namespace App\Transformations;

use App\Category;

trait CategoryTransformable {

    protected function transformCategory(Category $category) {
        $prop = new Category;
        $prop->id = (int) $category->id;
        $prop->name = $category->name;
        $prop->status = $category->status;
        return $prop;
    }

}
