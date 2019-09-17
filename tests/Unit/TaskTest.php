<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Task;
use App\User;
use App\Repositories\TaskRepository;
use Illuminate\Support\Collection;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class TaskTest extends TestCase {

    use DatabaseTransactions;

    private $user;

    public function setUp() {
        parent::setUp();
        $this->beginDatabaseTransaction();
        $this->user = factory(User::class)->create();
    }

    /** @test */
    public function it_can_show_all_the_tasks() {
        $insertedtask = factory(Task::class)->create();
        $taskRepo = new TaskRepository(new Task);
        $list = $taskRepo->listTasks()->toArray();
        $myLastElement = end($list);
        // $this->assertInstanceOf(Collection::class, $list);
        $this->assertEquals($insertedtask->title, $myLastElement['title']);
    }

    /** @test */
    public function it_can_delete_the_task() {
        $task = factory(Task::class)->create();
        $taskRepo = new TaskRepository($task);
        $deleted = $taskRepo->deleteTask($task->id);
        $this->assertTrue($deleted);
    }

    /** @test */
    public function it_can_update_the_task() {
        $task = factory(Task::class)->create();
        $title = 'unit-test';
        $data = ['title' => $title];
        $taskRepo = new TaskRepository($task);
        $updated = $taskRepo->updateTask($data);
        $found = $taskRepo->findTaskById($task->id);
        $this->assertTrue($updated);
        $this->assertEquals($data['title'], $found->title);
    }

    /** @test */
    public function it_can_show_the_task() {
        $task = factory(Task::class)->create();
        $taskRepo = new TaskRepository(new Task);
        $found = $taskRepo->findTaskById($task->id);
        $this->assertInstanceOf(Task::class, $found);
        $this->assertEquals($task->name, $found->name);
    }

    /** @test */
    public function it_can_create_a_task() {

        $data = [
            'title' => 'unit-test',
            'content' => 'new task',
            'is_completed' => 0,
            'contributors' => $this->user->id,
            'task_color' => 'colorBlue',
            'due_date' => date('Y-m-d H:i:s'),
        ];

        $taskRepo = new TaskRepository(new Task);
        $task = $taskRepo->createTask($data);
        $this->assertInstanceOf(Task::class, $task);
        $this->assertEquals($data['title'], $task->title);
    }

    /**
     * @codeCoverageIgnore
     */
    public function it_errors_creating_the_task_when_required_fields_are_not_passed() {
        $this->expectException(\Illuminate\Database\QueryException::class);
        $task = new TaskRepository(new Task);
        $task->createTask([]);
    }

    /** @test */
    public function it_errors_finding_a_task() {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        $task = new TaskRepository(new Task);
        $task->findTaskById(999);
    }

    public function tearDown() {
        parent::tearDown();
    }

}
