<?php

namespace App\Transformations;

use App\Product;
use App\Repositories\BrandRepository;
use App\Brand;

trait ProductTransformable {

    /**
     * Transform the product
     *
     * @param Product $product
     * @return Product
     */
    protected function transformProduct(Product $product) {
        $prod = new Product;
        $objBrand = (new BrandRepository(new Brand))->findBrandById($product->brand_id);
        
        $prod->id = (int) $product->id;
        $prod->name = $product->name;
        $prod->sku = $product->sku;
        $prod->slug = $product->slug;
        $prod->description = $product->description;
        $prod->price = $product->price;
        $prod->status = $product->status;
        $prod->brand_id = (int) $product->brand_id;
        $prod->brand = $objBrand->name;
        $prod->category_ids = $product->categories()->pluck('category_id')->all();

        return $prod;
    }

}
