<?php

namespace App\Repositories;

use App\Event;
use App\Repositories\Interfaces\EventRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use Illuminate\Support\Collection;
use App\Repositories\UserRepository;
use App\User;

class EventRepository extends BaseRepository implements EventRepositoryInterface {

    /**
     * EventRepository constructor.
     *
     * @param Event $event
     */
    public function __construct(Event $event) {
        parent::__construct($event);
        $this->model = $event;
    }

    /**
     * @param array $data
     *
     * @return User
     * @throws CreateProjectErrorException
     */
    public function createEvent(array $data): Event {
        try {
            return $this->create($data);
        } catch (QueryException $e) {
            throw new CreateUserErrorException($e);
        }
    }

    /**
     * @param int $id
     *
     * @return User
     * @throws \Exception
     */
    public function findEventById(int $id): Event {
        return $this->findOneOrFail($id);
    }

    /**
     * @param array $data
     * @param int $id
     *
     * @return bool
     * @throws \Exception
     */
    public function updateEvent(array $data): bool {
        return $this->update($data);
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteEvent(): bool {
        return $this->delete();
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     *
     * @return Collection
     */
    public function listEvents($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc'): Collection {
        return $this->all($columns, $orderBy, $sortBy);
    }

    /**
     * 
     * @param Event $objEvent
     * @param array $arrUsers
     */
    public function attachUsers(Event $objEvent, array $arrUsers) {
        
        $objEvent->users()->detach();
        
        foreach ($arrUsers as $userId) {
            $objUser = (new UserRepository(new User))->findUserById($userId);
            $objEvent->users()->attach($objUser);
        }
    }

}
