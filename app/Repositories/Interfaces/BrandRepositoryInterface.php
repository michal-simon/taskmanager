<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Base\BaseRepositoryInterface;
use App\Brand;
use App\Product;
use Illuminate\Support\Collection;

interface BrandRepositoryInterface extends BaseRepositoryInterface {

    /**
     * 
     * @param array $data
     */
    public function createBrand(array $data): Brand;

    /**
     * 
     * @param int $id
     */
    public function findBrandById(int $id): Brand;

    /**
     * 
     * @param array $data
     */
    public function updateBrand(array $data): bool;

    /**
     * 
     */
    public function deleteBrand(): bool;

    /**
     * 
     * @param type $columns
     * @param string $orderBy
     * @param string $sortBy
     */
    public function listBrands($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc'): Collection;

    /**
     * 
     * @param Product $product
     */
    public function saveProduct(Product $product);
}
