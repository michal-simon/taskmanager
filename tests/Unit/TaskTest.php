<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Task;
use App\User;
use App\Product;
use App\Customer;
use App\Repositories\TaskRepository;
use Illuminate\Support\Collection;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class TaskTest extends TestCase {

    use DatabaseTransactions,
        WithFaker;

    private $user;
    private $customer;

    public function setUp(): void {
        parent::setUp();
        $this->beginDatabaseTransaction();
        $this->user = factory(User::class)->create();
        $this->customer = factory(Customer::class)->create();
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
        $title = $this->faker->word;
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
    public function it_can_attach_a_user() {
        $user = factory(User::class)->create();
        $task = factory(Task::class)->create();
        $taskRepo = new TaskRepository($task);
        $result = $taskRepo->syncUsers([$user->id]);
        $this->assertArrayHasKey('attached', $result);
    }

    /** @test */
    public function it_can_attach_a_product() {
        $product = factory(Product::class)->create();
        $task = factory(Task::class)->create();
        $taskRepo = new TaskRepository($task);
        $result = $taskRepo->syncProducts([$product->id]);
        $this->assertArrayHasKey('attached', $result);
    }

    /** @test */
    public function it_can_create_a_task() {

        $data = [
            'customer_id' => $this->customer->id,
            'title' => $this->faker->word,
            'content' => $this->faker->sentence,
            'is_completed' => 0,
            'due_date' => $this->faker->dateTime,
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

    public function tearDown(): void {
        parent::tearDown();
    }

}
