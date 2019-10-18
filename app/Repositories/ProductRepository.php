<?php

namespace App\Repositories;

use App\Repositories\Base\BaseRepository;
use App\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection as Support;
use Illuminate\Database\Eloquent\Collection;
use App\Task;
use App\Brand;
use App\Category;
use App\ProductAttribute;
use Illuminate\Http\Request;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface {

    /**
     * ProductRepository constructor.
     * @param Product $product
     */
    public function __construct(Product $product) {
        parent::__construct($product);
        $this->model = $product;
    }

    /**
     * List all the products
     *
     * @param string $order
     * @param string $sort
     * @param array $columns
     * @return Collection
     */
    public function listProducts(string $order = 'id', string $sort = 'desc', array $columns = ['*']): Support {
        return $this->all($columns, $order, $sort);
    }

    /**
     * Create the product
     *
     * @param array $params
     * @return Product
     */
    public function createProduct(array $params): Product {
        return $this->create($params);
    }

    /**
     * Update the product
     *
     * @param array $params
     * @param int $id
     * @return bool
     */
    public function updateProduct(array $params): bool {
        return $this->model->update($params);
    }

    /**
     * Find the product by ID
     *
     * @param int $id
     *
     * @return Product
     * @throws ProductNotFoundException
     */
    public function findProductById(int $id): Product {
        return $this->findOneOrFail($id);
    }

    /**
     * Delete the product
     *
     * @param Product $product
     *
     * @return bool
     * @throws \Exception
     */
    public function deleteProduct(): bool {
        return $this->delete();
    }

    /**
     * Get the product via slug
     *
     * @param array $slug
     *
     * @return Product
     * @throws ProductNotFoundException
     */
    public function findProductBySlug(array $slug): Product {
        return $this->findOneByOrFail($slug);
    }

    /**
     * @param string $text
     * @return mixed
     */
    public function searchProduct(string $text = null): Support {
        if (is_null($text)) {
            return $this->all();
        }

        return $this->model->searchProduct($text)->get();
    }

    /**
     * List all the products
     *
     * @param string $order
     * @param string $sort
     * @param array $columns
     * @return Collection
     */
    public function getProductsForTask(Task $objTask): Support {
        return $this->model->join('product_task', 'product_task.product_id', '=', 'products.id')
                        ->select('products.*')
                        ->where('product_task.task_id', $objTask->id)
                        ->get();
    }

    /**
     * Detach the categories
     */
    public function detachCategories() {
        $this->model->categories()->detach();
    }

    /**
     * Return the categories which the product is associated with
     *
     * @return Collection
     */
    public function getCategories(): Collection {
        return $this->model->categories()->get();
    }

    /**
     * Sync the categories
     *
     * @param array $params
     */
    public function syncCategories(array $params) {
        $this->model->categories()->sync($params);
    }

    /**
     * @param Brand $brand
     */
    public function saveBrand(Brand $brand) {
        $this->model->brand()->associate($brand);
    }

    /**
     * @return Brand
     */
    public function findBrand() {
        return $this->model->brand;
    }

    /**
     * 
     * @param Brand $objBrand
     * @return Support
     */
    public function filterProductsByBrand(Brand $objBrand): Support {
        return $this->model->where('brand_id', $objBrand->id)->get();
    }

    /**
     * 
     * @param Category $objCategory
     * @return Support
     */
    public function filterProductsByCategory(Category $objCategory): Support {

        return $this->model->join('category_product', 'category_product.product_id', '=', 'products.id')
                        ->select('products.*')
                        ->where('category_product.category_id', $objCategory->id)
                        ->groupBy('products.id')
                        ->get();
    }

    /**
     * Delete the attribute from the product
     *
     * @param ProductAttribute $productAttribute
     *
     * @return bool|null
     * @throws \Exception
     */
    public function removeProductAttribute(ProductAttribute $productAttribute): ?bool {
        return $this->model->attributes()->delete();
    }

    /**
     * List all the product attributes associated with the product
     *
     * @return Collection
     */
    public function listProductAttributes(): Collection {
        return $this->model->attributes()->get();
    }

    /**
     * Associate the product attribute to the product
     *
     * @param ProductAttribute $productAttribute
     * @return ProductAttribute
     */
    public function saveProductAttributes(ProductAttribute $productAttribute): ProductAttribute {

        $this->model->attributes()->updateOrCreate(
                ['product_id' => $this->model->id], $productAttribute->toArray()
        );

        return $productAttribute;
    }

    /**
     * 
     * @param Category $category
     * @param type $value
     */
    public function getProductsByDealValueAndCategory(Category $category, Request $request): Support {
        return $this->model->join('product_attributes', 'product_attributes.product_id', '=', 'products.id')
                        ->join('category_product', 'category_product.product_id', '=', 'products.id')
                        ->select('products.*')
                        ->where('product_attributes.range_from', '<', $request->valued_at)->where('product_attributes.range_to', '>', $request->valued_at)
                        ->where('products.status', '=', 1)
                        ->where('category_product.category_id', '=', $category->id)
                        ->get();
    }

}
