<?php

namespace Tests\Unit;

use App\Product;
use App\Repositories\ProductRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Transformations\ProductTransformable;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Collection;
use App\Category;

class ProductTest extends TestCase {

    use DatabaseTransactions,
        ProductTransformable,
        WithFaker;

    public function setUp(): void {
        parent::setUp();
        $this->beginDatabaseTransaction();
    }

    /** @test */
    public function it_can_search_the_product() {
        $product = factory(Product::class)->create();
        $name = str_limit($product->name, 2, '');
        $productRepo = new ProductRepository($product);
        $results = $productRepo->searchProduct($name);
        $this->assertGreaterThan(0, $results->count());
    }

    /** @test */
    public function it_errors_when_the_slug_in_not_found() {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        $product = new ProductRepository(new Product);
        $product->findProductBySlug(['slug' => 'unknown']);
    }

    public function it_errors_creating_the_product_when_required_fields_are_not_passed() {
        $this->expectException(\Illuminate\Database\QueryException::class);
        $task = new ProductRepository(new Product);
        $task->createProduct([]);
    }

    /** @test */
    public function it_can_find_the_product_with_the_slug() {
        $product = factory(Product::class)->create();
        $productRepo = new ProductRepository(new Product);
        $found = $productRepo->findProductBySlug(['slug' => $product->slug]);
        $this->assertEquals($product->name, $found->name);
    }

    /** @test */
    public function it_can_delete_a_product() {
        $product = factory(Product::class)->create();
        $productRepo = new ProductRepository($product);
        $deleted = $productRepo->deleteProduct();
        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('products', ['name' => $product->name]);
    }

    /** @test */
    public function it_can_list_all_the_products() {
        $product = factory(Product::class)->create();
        $attributes = $product->getFillable();
        $productRepo = new ProductRepository(new Product);
        $products = $productRepo->listProducts();
        $products->each(function ($product, $key) use ($attributes) {
            foreach ($product->getFillable() as $key => $value) {
                $this->assertArrayHasKey($key, $attributes);
            }
        });
    }

    /** @test */
    public function it_errors_finding_a_product() {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        $product = new ProductRepository(new Product);
        $product->findProductById(999);
    }

    /** @test */
    public function it_can_find_the_product() {
        $product = factory(Product::class)->create();
        $productRepo = new ProductRepository(new Product);
        $found = $productRepo->findProductById($product->id);
        $this->assertInstanceOf(Product::class, $found);
        $this->assertEquals($product->sku, $found->sku);
        $this->assertEquals($product->name, $found->name);
        $this->assertEquals($product->slug, $found->slug);
        $this->assertEquals($product->description, $found->description);
        $this->assertEquals($product->price, $found->price);
        $this->assertEquals($product->status, $found->status);
    }

    /** @test */
    public function it_can_update_a_product() {
        $product = factory(Product::class)->create();
        $productName = 'apple';
        $data = [
            'sku' => '11111',
            'name' => $productName,
            'slug' => str_slug($productName),
            'description' => $this->faker->paragraph,
            'price' => 9.95,
            'status' => 1
        ];
        $productRepo = new ProductRepository($product);
        $updated = $productRepo->updateProduct($data);
        $this->assertTrue($updated);
    }

    /** @test */
    public function it_can_create_a_product() {
        $product = $this->faker->name;

        $params = [
            'sku' => $this->faker->numberBetween(1111111, 999999),
            'name' => $product,
            'slug' => str_slug($product),
            'description' => $this->faker->paragraph,
            'price' => 9.95,
            'status' => 1,
        ];
        $product = new ProductRepository(new Product);
        $created = $product->createProduct($params);
        $this->assertInstanceOf(Product::class, $created);
        $this->assertEquals($params['sku'], $created->sku);
        $this->assertEquals($params['name'], $created->name);
        $this->assertEquals($params['slug'], $created->slug);
        $this->assertEquals($params['description'], $created->description);
        $this->assertEquals($params['price'], $created->price);
        $this->assertEquals($params['status'], $created->status);
    }

    /** @test */
    public function it_can_detach_all_the_categories() {
        $product = factory(Product::class)->create();
        $categories = factory(Category::class, 4)->create();
        $productRepo = new ProductRepository($product);
        $ids = $categories->transform(function (Category $category) {
                    return $category->id;
                })->all();
        $productRepo->syncCategories($ids);
        $this->assertCount(4, $productRepo->getCategories());
        $productRepo->detachCategories();
        $this->assertCount(0, $productRepo->getCategories());
    }

    public function tearDown(): void {
        parent::tearDown();
    }

}
