<?php
namespace App\Repositories\Interfaces;

use App\Event;
use Illuminate\Support\Collection;
use App\Repositories\Base\BaseRepositoryInterface;

interface EventRepositoryInterface extends BaseRepositoryInterface
{
    //public function getAll(string $orderBy, string $orderDir, int $recordsPerPage, $blActive = true);
    public function listEvents($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Collection;
    public function deleteEvent() : bool;
    public function updateEvent(array $data) : bool;
    public function findEventById(int $id) : Event;
    public function createEvent(array $data) : Event;
}