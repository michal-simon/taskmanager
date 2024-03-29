<?php

namespace App\Repositories;

use App\Repositories\Base\BaseRepository;
use App\Brand;
use App\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
use App\Repositories\Interfaces\BrandRepositoryInterface;

class BrandRepository extends BaseRepository implements BrandRepositoryInterface {

    /**
     * BrandRepository constructor.
     *
     * @param Brand $brand
     */
    public function __construct(Brand $brand) {
        parent::__construct($brand);
        $this->model = $brand;
    }

    /**
     * @param array $data
     *
     * @return Brand
     */
    public function createBrand(array $data): Brand {
        return $this->create($data);
    }

    /**
     * @param int $id
     *
     * @return Brand
     */
    public function findBrandById(int $id): Brand {
        return $this->findOneOrFail($id);
    }

    /**
     * @param array $data
     * @param int $id
     *
     * @return bool
     */
    public function updateBrand(array $data): bool {
        return $this->update($data);
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteBrand(): bool {
        return $this->delete();
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     *
     * @return Collection
     */
    public function listBrands($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc'): Collection {
        return $this->all($columns, $orderBy, $sortBy);
    }

    /**
     * @return Collection
     */
    public function listProducts(): Collection {
        return $this->model->products()->get();
    }

    /**
     * @param Product $product
     */
    public function saveProduct(Product $product) {
        $this->model->products()->save($product);
    }

    /**
     * Dissociate the products
     */
    public function dissociateProducts() {
        $this->model->products()->each(function (Product $product) {
            $product->brand_id = null;
            $product->save();
        });
    }
    
       /**
     * @param string $text
     * @return mixed
     */
    public function searchBrand(string $text = null): Collection {
        if (is_null($text)) {
            return $this->all();
        }

        return $this->model->searchBrand($text)->get();
    }

}
