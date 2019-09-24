<?php

namespace App\Repositories;

use App\Repositories\Base\BaseRepository;
use App\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection as Support;
use Illuminate\Database\Eloquent\Collection;
use App\Task;

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
    public function searchProduct(string $text = null): Collection {
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
        return $this->all();
    }

}
