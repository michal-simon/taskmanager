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

        $attributes = $product->attributes->first();

        $prod->id = (int) $product->id;
        $prod->name = $product->name;
        $prod->sku = $product->sku;
        $prod->slug = $product->slug;
        $prod->description = $product->description;
        $prod->price = $product->price;
        $prod->status = $product->status;
        $prod->brand_id = (int) $product->brand_id;
        $prod->brand = $product->brand->name;
        $prod->category_ids = $product->categories()->pluck('category_id')->all();

        if ($attributes && $attributes->count() > 0) { 
            $prod->range_from = $attributes->range_from;
            $prod->range_to = $attributes->range_to;
            $prod->monthly_price = $attributes->monthly_price;
            $prod->full_price = $attributes->full_price;
            $prod->interest_rate = $attributes->interest_rate;
        }
        
        return $prod;
    }

}
