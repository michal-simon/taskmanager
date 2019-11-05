<?php

namespace App\Transformations;

use App\Customer;

trait CustomerTransformable {

    protected function transformCustomer(Customer $customer) {

        $company = !empty($customer->company_id) ? $customer->company->toArray() : '';
        $customer_type = $customer->customerType;

        $prop = new Customer;
        $prop->id = (int) $customer->id;
        $prop->name = $customer->first_name . " " . $customer->last_name;
        $prop->first_name = $customer->first_name;
        $prop->last_name = $customer->last_name;
        $prop->email = $customer->email;
        $prop->phone = $customer->phone;
        $prop->address = $customer->addresses->count() > 0 ? $customer->addresses->first() : '';
        $prop->company_id = $customer->company_id;
        $prop->company = $company;
        //$prop->customerType = $customer_type;
        $prop->customer_type = $customer->customer_type;

        return $prop;
    }

}
