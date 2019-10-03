<?php

namespace Tests\Unit;

use App\Brand;
use App\Repositories\BrandRepository;
use Illuminate\Support\Collection;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class BrandUnitTest extends TestCase {

    use WithFaker,
        DatabaseTransactions;

    public function setUp(): void {
        parent::setUp();
        $this->beginDatabaseTransaction();
    }

    /** @test */
    public function it_can_show_all_the_brands() {
        $insertedbrand = factory(Brand::class)->create();
        $brandRepo = new BrandRepository(new Brand);
        $list = $brandRepo->listBrands()->toArray();
        $myLastElement = end($list);
        $this->assertEquals($insertedbrand->toArray(), $myLastElement);
    }

    /** @test */
    public function it_can_delete_the_brand() {
        $brand = factory(Brand::class)->create();
        $brandRepo = new BrandRepository($brand);
        $deleted = $brandRepo->deleteBrand($brand->id);
        $this->assertTrue($deleted);
    }

    /** @test */
    public function it_can_update_the_brand() {
        $brand = factory(Brand::class)->create();
        $data = ['name' => $this->faker->company];
        $brandRepo = new BrandRepository($brand);
        $updated = $brandRepo->updateBrand($data);
        $found = $brandRepo->findBrandById($brand->id);
        $this->assertTrue($updated);
        $this->assertEquals($data['name'], $found->name);
    }

    /** @test */
    public function it_can_show_the_brand() {
        $brand = factory(Brand::class)->create();
        $brandRepo = new BrandRepository(new Brand);
        $found = $brandRepo->findBrandById($brand->id);
        $this->assertInstanceOf(Brand::class, $found);
        $this->assertEquals($brand->name, $found->name);
    }

    /** @test */
    public function it_can_create_a_brand() {

        $data = [
            'name' => $this->faker->company,
            'website' => $this->faker->url,
            'phone_number' => $this->faker->phoneNumber,
            'email' => $this->faker->email,
            'address_1' => $this->faker->streetName,
            'address_2' => $this->faker->streetAddress,
            'town' => $this->faker->word,
            'city' => $this->faker->city,
            'postcode' => $this->faker->postcode
        ];
        $brandRepo = new BrandRepository(new Brand);
        $brand = $brandRepo->createBrand($data);
        $this->assertInstanceOf(Brand::class, $brand);
        $this->assertEquals($data['name'], $brand->name);
    }

}
