<?php

namespace Tests\Unit;

use App\Customer;
use App\Repositories\CustomerRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Transformations\CustomerTransformable;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Collection;

class CustomerUnitTest extends TestCase {

    use DatabaseTransactions,
        CustomerTransformable,
            WithFaker;

    public function setUp() : void {
        parent::setUp();
        $this->beginDatabaseTransaction();
    }

    /** @test */
    public function it_can_transform_the_customer() {
        $customer = factory(Customer::class)->create();
        $repo = new CustomerRepository($customer);
        $customerFromDb = $repo->findCustomerById($customer->id);
        $cust = $this->transformCustomer($customer);
        //$this->assertInternalType('string', $customerFromDb->status);
        $this->assertInternalType('string', $cust->first_name);
    }
    
    /** @test */
    public function it_can_delete_a_customer() {
        $customer = factory(Customer::class)->create();
        $customerRepo = new CustomerRepository($customer);
        $delete = $customerRepo->deleteCustomer();
        $this->assertTrue($delete);
        //$this->assertDatabaseHas('customers', $customer->toArray());
    }

    /** @test */
    public function it_fails_when_the_customer_is_not_found() {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        $customer = new CustomerRepository(new Customer);
        $customer->findCustomerById(999);
    }

    /** @test */
    public function it_can_find_a_customer() {
        $data = [
            'first_name' => $this->faker->firstName,
            'email' => $this->faker->email,
        ];
        $customer = new CustomerRepository(new Customer);
        $created = $customer->createCustomer($data);
        $found = $customer->findCustomerById($created->id);
        $this->assertInstanceOf(Customer::class, $found);
        $this->assertEquals($data['first_name'], $found->first_name);
        $this->assertEquals($data['email'], $found->email);
    }

    /** @test */
    public function it_can_update_the_customer() {
        $cust = factory(Customer::class)->create();
        $customer = new CustomerRepository($cust);
        $update = [
            'first_name' => $this->faker->firstName,
        ];
        $updated = $customer->updateCustomer($update);
        $this->assertTrue($updated);
        $this->assertEquals($update['first_name'], $cust->first_name);
        $this->assertDatabaseHas('customers', $update);
    }

    /** @test */
    public function it_can_create_a_customer() {
        $data = [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'email' => $this->faker->email,
        ];
        $customer = new CustomerRepository(new Customer);
        $created = $customer->createCustomer($data);
        $this->assertInstanceOf(Customer::class, $created);
        $this->assertEquals($data['first_name'], $created->first_name);
        $this->assertEquals($data['email'], $created->email);
        $collection = collect($data)->except('password');
        $this->assertDatabaseHas('customers', $collection->all());
    }
    
     public function it_errors_creating_the_customer_when_required_fields_are_not_passed() {
        $this->expectException(\Illuminate\Database\QueryException::class);
        $task = new CustomerRepository(new Customer);
        $task->createCustomer([]);
    }
    
    /** @test */
    public function it_can_list_all_customers() {
        factory(Customer::class, 5)->create();
        $customerRepo = new CustomerRepository(new Customer);
        $list = $customerRepo->listCustomers();
        $this->assertInstanceOf(Collection::class, $list);
    }

    public function tearDown() : void {
        parent::tearDown();
    }

}
