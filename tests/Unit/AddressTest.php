<?php

namespace Tests\Unit;

use App\Address;
use App\Repositories\AddressRepository;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AddressUnitTest extends TestCase {
    
    use DatabaseTransactions;

    public function setUp() {
        parent::setUp();
        $this->beginDatabaseTransaction();
    }

    /** @test */
    public function it_can_delete_the_address() {
        $created = factory(Address::class)->create();
        $address = new AddressRepository($created);
        $address->deleteAddress();
        $this->assertDatabaseHas('addresses', ['id' => $created->id]);
    }

    /** @test */
    public function it_can_update_the_address() {
        $address = factory(Address::class)->create();
        $data = [
            'alias' => $this->faker->unique()->word,
            'address_1' => $this->faker->unique()->word,
            'address_2' => null,
            'zip' => 1101,
            'status' => 1
        ];
        $addressRepo = new AddressRepository($address);
        $updated = $addressRepo->updateAddress($data);
        $address = $addressRepo->findAddressById($address->id);
        $this->assertTrue($updated);
        $this->assertEquals($data['alias'], $address->alias);
        $this->assertEquals($data['address_1'], $address->address_1);
        $this->assertEquals($data['address_2'], $address->address_2);
        $this->assertEquals($data['zip'], $address->zip);
        $this->assertEquals($data['status'], $address->status);
    }

    public function tearDown() {
        parent::tearDown();
    }

}
