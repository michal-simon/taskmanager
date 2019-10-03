<?php

namespace App\Transformations;

use App\Event;
use App\Customer;
use App\Repositories\CustomerRepository;

trait EventTransformable {

    /**
     * Transform the event
     *
     * @param Event $event
     * @return Event
     */
    protected function transformEvent(Event $event) {
        $prop = new Event;
        
        $customer = $event->customer;

        $prop->id = (int) $event->id;
        $prop->location = $event->location;
        $prop->customer_id = $customer->id;
        $prop->first_name = $customer->first_name;
        $prop->last_name = $customer->last_name;
        $prop->title = $event->title;
        $prop->beginDate = date("D M d Y H:i:s", strtotime($event->beginDate));
        $prop->endDate = date("D M d Y H:i:s", strtotime($event->endDate));
        $prop->attendees = $event->users;
       
        return $prop;
    }

}
