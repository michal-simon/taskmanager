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

        $range_from = $range_to = $payable_months = $minimum_downpayment = $number_of_years = $interest_rate = 0;

        if ($attributes && $attributes->count() > 0) {
            $range_from = $attributes->range_from;
            $range_to = $attributes->range_to;
            $payable_months = $attributes->payable_months;
            $minimum_downpayment = $attributes->minimum_downpayment;
            $number_of_years = $attributes->number_of_years;
            $interest_rate = $attributes->interest_rate;
        }

        $prod->range_from = $range_from;
        $prod->range_to = $range_to;
        $prod->payable_months = $payable_months;
        $prod->minimum_downpayment = $minimum_downpayment;
        $prod->number_of_years = $number_of_years;
        $prod->interest_rate = $interest_rate;

        return $prod;
    }

}
