<?php

namespace App\Repositories;

use App\Event;
use App\Repositories\Interfaces\EventRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use Illuminate\Support\Collection;
use App\Repositories\UserRepository;
use App\User;
use App\Task;

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
        $result = $this->delete();
        $this->model->users()->detach();
        return $result;
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
        
        return true;
    }

    /**
     * Sync the categories
     *
     * @param array $params
     */
    public function syncTask(int $task_id) {
        return $this->model->tasks()->sync($task_id);
    }

    /**
     * 
     * @param Task $objTask
     * @return Collection
     */
    public function getEventsForTask(Task $objTask): Collection {

        return $this->model->join('event_task', 'event_task.event_id', '=', 'events.id')
                        ->select('events.*')
                        ->where('event_task.task_id', $objTask->id)
                        ->groupBy('events.id')
                        ->get();
    }

    /**
     * 
     * @param User $objUser
     * @return Collection
     */
    public function getEventsForUser(User $objUser): Collection {
        return $this->model->join('event_user', 'event_user.event_id', '=', 'events.id')
                        ->select('events.*')
                        ->where('event_user.user_id', $objUser->id)
                        ->get();
    }

    public function updateInvitationResponseForUser(User $objUser, $status) {
        $this->model->users()->updateExistingPivot($objUser->id, ['status' => $status]);
    }

        /**
     * 
     * @param array $arrFilters
     * @param type $task_type
     * @return Support
     */
    public function filterEvents(array $arrFilters): Support {
        $query = $this->model->select('tasks.id as id', 'tasks.*')
                ->leftJoin('task_user', 'tasks.id', '=', 'task_user.task_id');
        if ($task_type === 1) {
            $query = $query->join('project_task', 'tasks.id', '=', 'project_task.task_id')
                    ->where('is_completed', 0)
                    ->where('parent_id', 0);
        } else {
            $query = $query->where('is_completed', 0)
                    ->where('task_type', $task_type);
        }
        foreach ($arrFilters as $arrFilter) {
            $query->where($arrFilter['column'], '=', $arrFilter['value']);
            if (!empty($arrFilter['project_id'])) {
                $query->where('project_id', $arrFilter['project_id']);
            }
            /* whereHas('user', function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->name}%");
            }); */
        }
        return $query->get();
    }
}
