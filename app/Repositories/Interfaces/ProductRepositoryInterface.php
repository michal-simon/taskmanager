<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Base\BaseRepositoryInterface;
use App\Product;
use Illuminate\Support\Collection as Support;
use Illuminate\Database\Eloquent\Collection;
use App\Task;
use App\Brand;
use App\Category;

interface ProductRepositoryInterface extends BaseRepositoryInterface {

    /**
     * 
     * @param string $order
     * @param string $sort
     * @param array $columns
     */
    public function listProducts(string $order = 'id', string $sort = 'desc', array $columns = ['*']): Support;

    /**
     * 
     * @param array $data
     */
    public function createProduct(array $data): Product;

    /**
     * 
     * @param array $params
     * @param int $id
     */
    public function updateProduct(array $params): bool;

    /**
     * 
     * @param int $id
     */
    public function findProductById(int $id): Product;

    /**
     * 
     */
    public function deleteProduct(): bool;

    /**
     * 
     * @param array $slug
     */
    public function findProductBySlug(array $slug): Product;

    /**
     * @param string $text
     * @return mixed
     */
    public function searchProduct(string $text = null): Collection;

    /**
     * 
     * @param \App\Repositories\Interfaces\Task $objTask
     */
    public function getProductsForTask(Task $objTask): Support;

    /**
     * 
     */
    public function detachCategories();

    /**
     * 
     */
    public function getCategories(): Collection;

    /**
     * 
     * @param array $params
     */
    public function syncCategories(array $params);
    
    /**
     * 
     * @param Brand $brand
     */
    public function saveBrand(Brand $brand);
    
    /**
     * 
     */
    public function findBrand();
    
    /**
     * 
     * @param Brand $objBrand
     */
    public function filterProductsByBrand(Brand $objBrand): Support;
    
    /**
     * 
     * @param \App\Repositories\Interfaces\Category $objCategory
     */
    public function filterProductsByCategory(Category $objCategory): Support;
}
