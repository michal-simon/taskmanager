<?php

namespace App\Transformations;

use App\Brand;

trait BrandTransformable {

    protected function transformBrand(Brand $brand) {
        $prop = new Brand;
        $prop->id = (int) $brand->id;
        $prop->name = $brand->name;

        return $prop;
    }

}
