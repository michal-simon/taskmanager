<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Event;
use App\Http\Requests\CreateEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Repositories\Interfaces\EventRepositoryInterface;
use App\Repositories\EventRepository;
use App\Transformations\EventTransformable;

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
        
         $arrData = [
            'customer_id' => $request->customer_id,
            'title' => $request->title,
            'location' => $request->location,
            'beginDate' => date('Y-m-d H:i:s', strtotime($request->beginDate)),
            'endDate' => date('Y-m-d H:i:s', strtotime($request->endDate))
        ];

        $event = $this->eventRepository->createEvent($arrData);
        $this->eventRepository->attachUsers($event, $request->users);
  
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
            'endDate' => date('Y-m-d H:i:s', strtotime($request->endDate))
        ];

        $eventRepo = new EventRepository($event);
        $eventResult = $eventRepo->updateEvent($arrData);

        $eventRepo->attachUsers($event, $request->users);
    }

}
