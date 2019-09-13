<?php
namespace App\Transformations;

use App\Customer;

trait CustomerTransformable
{
    protected function transformCustomer(Customer $customer)
    {
        $prop = new Customer;
        
        $prop->id = (int) $customer->id;
        $prop->first_name = $customer->first_name;
        $prop->last_name = $customer->last_name;
        $prop->email = $customer->email;
        $prop->status = (int) $customer->status;
        $prop->addresses = $customer->addresses;
        return $prop;
    }
}