<?php

namespace App\Http\Controllers;

use App\Event;
use Illuminate\Http\Request;
use App\Requests\CreateEventRequest;
use App\Requests\UpdateEventRequest;
use App\Repositories\Interfaces\EventRepositoryInterface;
use App\Transformations\EventTransformable;
use App\Repositories\TaskRepository;
use App\Task;
use App\Repositories\UserRepository;
use App\User;
use App\Repositories\EventTypeRepository;
use App\EventType;
use App\Services\interfaces\EventServiceInterface;

class EventController extends Controller {

    use EventTransformable;

    private $eventRepository;
    private $eventService;

    /**
     * 
     * @param EventRepositoryInterface $eventRepository
     */
    public function __construct(EventRepositoryInterface $eventRepository, EventServiceInterface $eventService) {
        $this->eventRepository = $eventRepository;
        $this->eventService = $eventService;
    }

    public function index() {
        $list = $this->eventRepository->listEvents(['*'], 'beginDate', 'asc');

        $events = $list->map(function (Event $event) {
                    return $this->transformEvent($event);
                })->all();

        return collect($events)->toJson();
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show(int $id) {
        $event = $this->eventRepository->findEventById($id);

        return $event->toJson();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(CreateEventRequest $request) {
        $event = $this->eventService->create($request);
        return $event->toJson();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy(int $id) {
        $response = $this->eventService->delete($id);

        if ($response) {
            return response()->json('Event deleted!');
        }
        return response()->json('Unable to delete event!');
    }

    /**
     * @param UpdateEventRequest $request
     * @param int $id
     *
     * @return Response
     */
    public function update(UpdateEventRequest $request, int $id) {
        $event = $this->eventService->update($request, $id);
    }

    /**
     * 
     * @param int $task_id
     * @return type
     */
    public function getEventsForTask(int $task_id) {

        $objTask = (new TaskRepository(new Task))->findTaskById($task_id);
        $events = $this->eventRepository->getEventsForTask($objTask);
        return $events->toJson();
    }

    /**
     * 
     * @param int $user_id
     * @return type
     */
    public function getEventsForUser(int $user_id) {
        $objTask = (new UserRepository(new User))->findUserById($user_id);
        $events = $this->eventRepository->getEventsForUser($objTask);
        return $events->toJson();
    }

    public function getEventTypes() {
        $eventTypes = (new EventTypeRepository(new EventType))->getAll();
        return response()->json($eventTypes);
    }

    /**
     * 
     * @param \App\Http\Controllers\Request $request
     * @return type
     */
    public function filterEvents(Request $request) {
        $list = $this->eventRepository->filterEvents($request->all());

        $events = $list->map(function (Event $event) {
                    return $this->transformEvent($event);
                })->all();

        return response()->json($events);
    }

    /**
     * 
     * @param type $id
     * @param Request $request
     */
    public function updateEventStatus($id, Request $request) {
        $this->eventService->updateEventStatus($id, $request);
    }

}
