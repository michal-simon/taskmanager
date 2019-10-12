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

        $range_from = $range_to = $monthly_price = $full_price = $interest_rate = 0;

        if ($attributes && $attributes->count() > 0) {
            $range_from = $attributes->range_from;
            $range_to = $attributes->range_to;
            $monthly_price = $attributes->monthly_price;
            $full_price = $attributes->full_price;
            $interest_rate = $attributes->interest_rate;
        }

        $prod->range_from = $range_from;
        $prod->range_to = $range_to;
        $prod->monthly_price = $monthly_price;
        $prod->full_price = $full_price;
        $prod->interest_rate = $interest_rate;

        return $prod;
    }

}
