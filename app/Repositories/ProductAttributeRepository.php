<?php

namespace App\Repositories;

use App\Repositories\Base\BaseRepository;
use App\ProductAttribute;
use App\Repositories\Interfaces\ProductAttributeRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductAttributeRepository extends BaseRepository implements ProductAttributeRepositoryInterface {

    /**
     * ProductAttributeRepository constructor.
     * @param ProductAttribute $productAttribute
     */
    public function __construct(ProductAttribute $productAttribute) {
        parent::__construct($productAttribute);
        $this->model = $productAttribute;
    }

    /**
     * @param int $id
     * @return mixed
     * @throws ProductAttributeNotFoundException
     */
    public function findProductAttributeById(int $id) {
        return $this->findOneOrFail($id);
    }

}
