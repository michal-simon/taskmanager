<?php

namespace App\Transformations;

use App\Product;

trait ProductTransformable {

    /**
     * Transform the product
     *
     * @param Product $product
     * @return Product
     */
    protected function transformProduct(Product $product) {
        $prod = new Product;
        $prod->id = (int) $product->id;
        $prod->name = $product->name;
        $prod->sku = $product->sku;
        $prod->slug = $product->slug;
        $prod->description = $product->description;
        $prod->price = $product->price;
        $prod->status = $product->status;

        return $prod;
    }

}
