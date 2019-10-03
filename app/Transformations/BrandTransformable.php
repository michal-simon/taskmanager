<?php

namespace App\Transformations;

use App\Brand;

trait BrandTransformable {

    protected function transformBrand(Brand $brand) {
        $prop = new Brand;
        $prop->id = (int) $brand->id;
        $prop->name = $brand->name;
        $prop->website = $brand->website;
        $prop->email = $brand->email;
        $prop->phone_number = $brand->phone_number;
        $prop->address_1 = $brand->address_1;
        $prop->address_2 = $brand->address_2;
        $prop->town = $brand->town;
        $prop->city = $brand->city;
        $prop->postcode = $brand->postcode;

        return $prop;
    }

}
