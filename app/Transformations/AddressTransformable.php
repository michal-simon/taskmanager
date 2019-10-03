<?php

namespace App\Transformations;

use App\Address;
use App\Customer;
use App\Repositories\CustomerRepository;

trait AddressTransformable {

    /**
     * Transform the address
     *
     * @param Address $address
     *
     * @return Address
     * @throws \App\Shop\Cities\Exceptions\CityNotFoundException
     * @throws \App\Shop\Countries\Exceptions\CountryNotFoundException
     * @throws \App\Shop\Customers\Exceptions\CustomerNotFoundException
     */
    public function transformAddress(Address $address) {
        $obj = new Address;
        $obj->id = $address->id;
        $obj->alias = $address->alias;
        $obj->address_1 = $address->address_1;
        $obj->address_2 = $address->address_2;
        $obj->zip = $address->zip;
        $obj->city = $address->city;
        $obj->country = 225;
        $customerRepo = new CustomerRepository(new Customer);
        $customer = $customerRepo->findCustomerById($address->customer_id);
        $obj->customer = $customer->name;
        $obj->status = $address->status;
        return $obj;
    }

}
