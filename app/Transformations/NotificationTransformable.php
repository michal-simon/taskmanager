<?php

namespace App\Transformations;

use App\Notification;
use App\Repositories\UserRepository;
use App\User;

trait NotificationTransformable {

    /**
     * 
     * @param Notification $notification
     * @return Notification
     */
    protected function transformNotification(Notification $notification) {
        
        $user = (new UserRepository(new User))->findUserById($notification->notifiable_id);
//        $data = json_decode($notification->data, true);
//        $message = $data['message'];
        
        $prop = new Notification;
        $prop->id = (int) $notification->id;
        $prop->type = $notification->type;
        $prop->user_id = $notification->notifiable_id;
        $prop->author = $user->first_name . ' ' . $user->last_name;
        $prop->data = json_decode($notification->data, true);
        $prop->created_at = $notification->created_at;

        return $prop;
    }

}
