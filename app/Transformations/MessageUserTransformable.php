<?php

namespace App\Transformations;

use App\Customer;
use App\Repositories\MessageRepository;
use App\Repositories\UserRepository;
use App\User;
use App\Message;

trait MessageUserTransformable {

    protected function transformUser(Customer $customer) {

        $currentUser = (new UserRepository(new User))->findUserById(56);


        $message = (new MessageRepository(new Message))->getMessagesForCustomer($customer, $currentUser, true);

        $prop = new Customer;

        $prop->customer_id = (int) $customer->id;
        $prop->name = $customer->first_name . ' ' . $customer->last_name;
        $prop->avatar = '';

        if (!empty($message)) {
            $prop->message = $message->message;
            $prop->when = $message->created_at;
            $prop->seen = false;
        }

        return $prop;
    }

}
