<?php

namespace App\Http\Controllers;

use App\Event;
use App\Requests\CreateEventRequest;
use App\Requests\UpdateEventRequest;
use App\Repositories\Interfaces\EventRepositoryInterface;
use App\Repositories\EventRepository;
use App\Transformations\EventTransformable;
use App\Repositories\TaskRepository;
use App\Task;
use App\Repositories\UserRepository;
use App\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\EventCreated;
use Illuminate\Support\Facades\Auth;
use App\Repositories\EventTypeRepository;
use App\EventType;

class EventController extends Controller {

    use EventTransformable;

    private $eventRepository;

    /**
     * 
     * @param EventRepositoryInterface $eventRepository
     */
    public function __construct(EventRepositoryInterface $eventRepository) {
        $this->eventRepository = $eventRepository;
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

        $user = Auth::user();

        $arrData = [
            'created_by' => $user->id,
            'customer_id' => $request->customer_id,
            'title' => $request->title,
            'location' => $request->location,
            'beginDate' => date('Y-m-d H:i:s', strtotime($request->beginDate)),
            'endDate' => date('Y-m-d H:i:s', strtotime($request->endDate)),
            'event_type' => $request->event_type,
            'description' => $request->description
        ];

        $event = $this->eventRepository->createEvent($arrData);

        //send notification

        Notification::send($user, new EventCreated($event));


        //attach invited users
        $this->eventRepository->attachUsers($event, $request->users);

        $eventRepo = new EventRepository($event);

        if ($request->has('task_id')) {
            $eventRepo->syncTask($request->input('task_id'));
        }

        return $event->toJson();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy(int $id) {
        $objEvent = $this->eventRepository->findEventById($id);
        $eventRepo = new EventRepository($objEvent);
        $eventRepo->deleteEvent();
        return response()->json('Event deleted!');
    }

    /**
     * @param UpdateEventRequest $request
     * @param int $id
     *
     * @return Response
     */
    public function update(UpdateEventRequest $request, int $id) {

        $event = $this->eventRepository->findEventById($id);

        $arrData = [
            'customer_id' => $request->customer_id,
            'title' => $request->title,
            'location' => $request->location,
            'beginDate' => date('Y-m-d H:i:s', strtotime($request->beginDate)),
            'endDate' => date('Y-m-d H:i:s', strtotime($request->endDate)),
            'event_type' => $request->event_type,
            'description' => $request->description
        ];

        $eventRepo = new EventRepository($event);
        $eventRepo->updateEvent($arrData);

        $eventRepo->attachUsers($event, $request->users);
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

}
