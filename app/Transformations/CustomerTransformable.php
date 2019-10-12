<?php

namespace App\Transformations;

use App\Customer;

trait CustomerTransformable {

    protected function transformCustomer(Customer $customer) {
        $prop = new Customer;
        $prop->id = (int) $customer->id;
        $prop->name = $customer->first_name . " " . $customer->last_name;
        $prop->company = $customer->company_name;
        $prop->email = $customer->email;
        $prop->phone = $customer->phone;
        $prop->address = $customer->addresses->count() > 0 ? $customer->addresses->first() : '';

        return $prop;
    }

}
