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
        $collection->each(function ($item) use ($order) {
            $this->assertEquals($item->reference, $order->reference);
            $this->assertEquals($item->courier_id, $order->courier_id);
            $this->assertEquals($item->customer_id, $order->customer_id);
            $this->assertEquals($item->address_id, $order->address_id);
        });
    }
    
    /** @test */
    public function it_errors_when_updating_the_order_status()
    {
        $this->expectException(OrderStatusInvalidArgumentException::class);
        $orderStatusRepo = new OrderStatusRepository($this->orderStatus);
        $orderStatusRepo->updateOrderStatus(['name' => null]);
    }
    /** @test */
    public function it_can_delete_the_order_status()
    {
        $os = factory(OrderStatus::class)->create();
        $orderStatusRepo = new OrderStatusRepository($os);
        $orderStatusRepo->deleteOrderStatus($os);
        $this->assertDatabaseMissing('order_statuses', $os->toArray());
    }
    
    /** @test */
    public function it_lists_all_the_order_statuses()
    {
        $create = [
            'name' => $this->faker->name,
            'color' => $this->faker->word
        ];
        $orderStatusRepo = new OrderStatusRepository(new OrderStatus);
        $orderStatusRepo->createOrderStatus($create);
        $orderStatusRepo = new OrderStatusRepository(new OrderStatus);
        $lists = $orderStatusRepo->listOrderStatuses();
        foreach ($lists as $list) {
            $this->assertDatabaseHas('order_statuses', ['name' => $list->name]);
            $this->assertDatabaseHas('order_statuses', ['color' => $list->color]);
        }
    }
    
    /** @test */
    public function it_errors_getting_not_existing_order_status()
    {
        $this->expectException(OrderStatusNotFoundException::class);
        $this->expectExceptionMessage('Order status not found.');
        $orderStatusRepo = new OrderStatusRepository(new OrderStatus);
        $orderStatusRepo->findOrderStatusById(999);
    }
    
    /** @test */
    public function it_can_get_the_order_status()
    {
        $create = [
            'name' => $this->faker->name,
            'color' => $this->faker->word
        ];
        $orderStatusRepo = new OrderStatusRepository(new OrderStatus);
        $orderStatus = $orderStatusRepo->createOrderStatus($create);
        $os = $orderStatusRepo->findOrderStatusById($orderStatus->id);
        $this->assertEquals($create['name'], $os->name);
        $this->assertEquals($create['color'], $os->color);
    }
    
    /** @test */
    public function it_can_update_the_order_status()
    {
        $orderStatusRepo = new OrderStatusRepository($this->orderStatus);
        $data = [
            'name' => $this->faker->name,
            'color' => $this->faker->word
        ];
        $updated = $orderStatusRepo->updateOrderStatus($data);
        $this->assertTrue($updated);
        $this->assertEquals($data['name'], $this->orderStatus->name);
        $this->assertEquals($data['color'], $this->orderStatus->color);
    }
    
    /** @test */
    public function it_errors_when_creating_the_order_status()
    {
        $this->expectException(OrderStatusInvalidArgumentException::class);
        $orderStatusRepo = new OrderStatusRepository(new OrderStatus);
        $orderStatusRepo->createOrderStatus([]);
    }
    
    /** @test */
    public function it_can_create_the_order_status()
    {
        $create = [
            'name' => $this->faker->name,
            'color' => $this->faker->word
        ];
        $orderStatusRepo = new OrderStatusRepository(new OrderStatus);
        $orderStatus = $orderStatusRepo->createOrderStatus($create);
        $this->assertEquals($create['name'], $orderStatus->name);
        $this->assertEquals($create['color'], $orderStatus->color);
    }
}
