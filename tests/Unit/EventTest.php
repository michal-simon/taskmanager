<?php

namespace Tests\Unit;

use App\Event;
use App\Task;
use App\User;
use App\Repositories\EventRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Transformations\EventTransformable;
use Illuminate\Foundation\Testing\WithFaker;

class EventUnitTest extends TestCase {

    use DatabaseTransactions,
        EventTransformable,
        WithFaker;

    public function setUp() : void {
        parent::setUp();
        $this->beginDatabaseTransaction();
    }

    /** @test */
    public function it_can_transform_the_event() {
        $event = factory(Event::class)->create();
        $repo = new EventRepository($event);
        $eventFromDb = $repo->findEventById($event->id);
        $cust = $this->transformEvent($event);
        //$this->assertInternalType('string', $eventFromDb->status);
        $this->assertInternalType('string', $cust->title);
    }

    /** @test */
    public function it_can_delete_a_event() {
        $event = factory(Event::class)->create();
        $eventRepo = new EventRepository($event);
        $delete = $eventRepo->deleteEvent();
        $this->assertTrue($delete);
        //$this->assertDatabaseHas('events', $event->toArray());
    }

    /** @test */
    public function it_fails_when_the_event_is_not_found() {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        $event = new EventRepository(new Event);
        $event->findEventById(999);
    }

    /** @test */
    public function it_can_find_a_event() {
        $data = [
            'title' => $this->faker->sentence,
            'location' => $this->faker->sentence,
        ];
        
        $event = new EventRepository(new Event);
        $created = $event->createEvent($data);
        $found = $event->findEventById($created->id);
        $this->assertInstanceOf(Event::class, $found);
        $this->assertEquals($data['title'], $found->title);
        $this->assertEquals($data['location'], $found->location);
    }

    /** @test */
    public function it_can_update_the_event() {
        $cust = factory(Event::class)->create();
        $event = new EventRepository($cust);
        $update = [
            'location' => $this->faker->sentence,
        ];
        $updated = $event->updateEvent($update);
        $this->assertTrue($updated);
        $this->assertEquals($update['location'], $cust->location);
        $this->assertDatabaseHas('events', $update);
    }

    /** @test */
    public function it_can_create_a_event() {
        $data = [
            'title' => $this->faker->word,
            'description' => $this->faker->sentence,
            'location' => $this->faker->sentence,
            'beginDate' => $this->faker->dateTime(),
            'endDate' => $this->faker->dateTime(),
            'customer_id' => 1,
            'event_type' => 2
        ];
        
        $event = new EventRepository(new Event);
        $created = $event->createEvent($data);
        $this->assertInstanceOf(Event::class, $created);
        $this->assertEquals($data['title'], $created->title);
        $this->assertEquals($data['location'], $created->location);
        $collection = collect($data);
        $this->assertDatabaseHas('events', $collection->all());
    }

    public function it_errors_creating_the_event_when_required_fields_are_not_passed() {
        $this->expectException(\Illuminate\Database\QueryException::class);
        $task = new EventRepository(new Event);
        $task->createEvent([]);
    }
    
    /** @test */
    public function it_can_attach_a_task() {
        $task = factory(Task::class)->create();
        $event = factory(Event::class)->create();
        $eventRepo = new EventRepository($event);
        $result = $eventRepo->syncTask($task->id);
        $this->assertArrayHasKey('attached', $result);
    }
    
     /** @test */
    public function it_can_attach_a_user() {
        $user = factory(User::class)->create();
        $event = factory(Event::class)->create();
        $eventRepo = new EventRepository($event);
        $result = $eventRepo->attachUsers($event, [$user->id]);
        $this->assertTrue($result);
    }

    public function tearDown() : void {
        parent::tearDown();
    }

}
