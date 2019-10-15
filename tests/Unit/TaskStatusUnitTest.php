<?php
namespace Tests\Unit;

use App\Shop\Orders\Order;
use App\TaskStatus;
use App\Repositories\TaskStatusRepository;
use Tests\TestCase;

class TaskStatusUnitTest extends TestCase
{
    /** @test */
    public function it_can_return_all_tasks_on_a_specific_order_status()
    {
        $taskStatus = factory(TaskStatus::class)->create();
        $task = factory(Task::class)->create([
            'task_status_id' => $taskStatus->id
        ]);
        $repo = new TaskStatusRepository($taskStatus);
        $collection = $repo->findTasks();
        $this->assertCount(1, $collection->all());
        $collection->each(function ($item) use ($task) {
            $this->assertEquals($item->reference, $order->reference);
            $this->assertEquals($item->courier_id, $order->courier_id);
            $this->assertEquals($item->customer_id, $order->customer_id);
            $this->assertEquals($item->address_id, $order->address_id);
        });
    }
    
    /** @test */
    public function it_errors_when_updating_the_task_status()
    {
        $taskStatus = factory(TaskStatus::class)->create();
        $this->expectException(OrderStatusInvalidArgumentException::class);
        $taskStatusRepo = new TaskStatusRepository($taskStatus);
        $taskStatusRepo->updateTaskStatus(['name' => null]);
    }
    /** @test */
    public function it_can_delete_the_order_status()
    {
        $os = factory(TaskStatus::class)->create();
        $taskStatusRepo = new TaskStatusRepository($os);
        $taskStatusRepo->deleteTaskStatus($os);
        $this->assertDatabaseMissing('task_statuses', $os->toArray());
    }
    
    /** @test */
    public function it_lists_all_the_task_statuses()
    {
        $create = [
            'title' => $this->faker->name,
            'column_color' => $this->faker->word
        ];
        $taskStatusRepo = new TaskStatusRepository(new TaskStatus);
        $taskStatusRepo->createTaskStatus($create);
        $taskStatusRepo = new TaskStatusRepository(new TaskStatus);
        $lists = $taskStatusRepo->listTaskStatuses();
        foreach ($lists as $list) {
            $this->assertDatabaseHas('task_statuses', ['title' => $list->title]);
            $this->assertDatabaseHas('task_statuses', [column_color' => $list->column_color]);
        }
    }
    
    /** @test */
    public function it_errors_getting_not_existing_order_status()
    {
        $this->expectException(OrderStatusNotFoundException::class);
        $this->expectExceptionMessage('Order status not found.');
        $taskStatusRepo = new TaskStatusRepository(new TaskStatus);
        $taskStatusRepo->findTaskStatusById(999);
    }
    
    /** @test */
    public function it_can_get_the_task_status()
    {
        $create = [
            'title' => $this->faker->name,
            'column_color' => $this->faker->word
        ];
        $taskStatusRepo = new TaskStatusRepository(new TaskStatus);
        $taskStatus = $taskStatusRepo->createTaskStatus($create);
        $os = $taskStatusRepo->findTaskStatusById($taskStatus->id);
        $this->assertEquals($create['title'], $os->title);
        $this->assertEquals($create['column_color'], $os->column_color);
    }
    
    /** @test */
    public function it_can_update_the_task_status()
    {
        $taskStatusRepo = new TaskStatusRepository($this->taskStatus);
        $data = [
            'title' => $this->faker->name,
            'column_color' => $this->faker->word
        ];
        $updated = $taskStatusRepo->updateTaskStatus($data);
        $this->assertTrue($updated);
        $this->assertEquals($data['title'], $this->taskStatus->title);
        $this->assertEquals($data['column_color'], $this->taskStatus->column_color);
    }
    
    /** @test */
    public function it_errors_when_creating_the_task_status()
    {
        $this->expectException(OrderStatusInvalidArgumentException::class);
        $taskStatusRepo = new TaskStatusRepository(new TaskStatus);
        $taskStatusRepo->createTaskStatus([]);
    }
    
    /** @test */
    public function it_can_create_the_task_status()
    {
        $create = [
            'title' => $this->faker->name,
            'column_color' => $this->faker->word
        ];
        $taskStatusRepo = new TaskStatusRepository(new TaskStatus);
        $taskStatus = $taskStatusRepo->createTaskStatus($create);
        $this->assertEquals($create['title'], $taskStatus->title);
        $this->assertEquals($create['column_color'], $taskStatus->column_color);
    }
}
