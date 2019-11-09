<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Services;

use Illuminate\Http\Request;
use App\Requests\CreateEventRequest;
use App\Requests\UpdateEventRequest;
use App\Repositories\Interfaces\EventRepositoryInterface;
use App\Repositories\EventRepository;
use Illuminate\Support\Facades\Notification;
use App\Notifications\EventCreated;
use Illuminate\Support\Facades\Auth;
use App\Services\Interfaces\EventServiceInterface;
use App\Services\EntityManager;

/**
 * Description of EventService
 *
 * @author michael.hampton
 */
class EventService implements EventServiceInterface {

    private $eventRepository;
    
    private $entityManager;

    /**
     * 
     * @param EventRepositoryInterface $eventRepository
     */
    public function __construct(EventRepositoryInterface $eventRepository) {
        $this->eventRepository = $eventRepository;
        $this->entityManager = new EntityManager();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function create(CreateEventRequest $request) {

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

        $eventRepo = $this->entityManager::getRepository($event);

        if ($request->has('task_id')) {
            $eventRepo->syncTask($request->input('task_id'));
        }

        return $event;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function delete(int $id) {
        $objEvent = $this->eventRepository->findEventById($id);
        $eventRepo = $this->entityManager::getRepository($objEvent);
        $eventRepo->deleteEvent();
        return true;
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

        $eventRepo = $this->entityManager::getRepository($event);
        $eventRepo->updateEvent($arrData);

        $eventRepo->attachUsers($event, $request->users);

        return $event;
    }

    /**
     * 
     * @param type $id
     * @param Request $request
     */
    public function updateEventStatus($id, Request $request) {
        $user = Auth::user();
        $event = $this->eventRepository->findEventById($id);
        $eventRepo = $this->entityManager::getRepository($event);
        $eventRepo->updateInvitationResponseForUser($user, $request->all());
        return true;
    }

}
