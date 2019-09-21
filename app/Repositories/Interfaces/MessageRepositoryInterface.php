<?php

namespace App\Repositories\Interfaces;

use App\Message;

/**
 *
 * @author michael.hampton
 */
interface MessageRepositoryInterface {

    public function createMessage(array $data): Message;
}
