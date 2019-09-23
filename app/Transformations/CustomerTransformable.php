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

        if (!empty($customer->addresses[0])) {
            $prop->address = $customer->addresses[0];
            $prop->phone = $customer->addresses[0]->phone;
        }

        return $prop;
    }

}
