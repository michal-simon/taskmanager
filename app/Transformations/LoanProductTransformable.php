<?php

namespace App\Transformations;

use App\Product;
use App\Category;
use App\Repositories\CategoryRepository;
use App\Traits\MonthlyPayments;
use Illuminate\Http\Request;

trait LoanProductTransformable {

    use MonthlyPayments;

    /**
     * Transform the product
     *
     * @param Product $product
     * @return Product
     */
    protected function transformLoanProduct(Product $product, Category $parentCategory, Request $request) {
        $prod = new Product;


        $attributes = $product->attributes->first();

        if (!$attributes || $attributes->count() === 0) {
            return false;
        }

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

        $interest_rate = $attributes->interest_rate;
        $value = $request->valued_at;
        $downpayment = $attributes->minimum_downpayment;
        $years = $attributes->number_of_years;
        $months = $attributes->payable_months;

        $prod->interest_rate = $interest_rate;
        $prod->value = $value;
        $prod->downpayment_percentage = $downpayment;
        $prod->years = $years;
        $prod->months = $months;


        if ($parentCategory->name === 'Mortgages') {
            $months = 0;
            $prod->frequency = 'Monthly';

            $newprice = ($value * ((100 - $downpayment) / 100));
            $downpayment_cost = ($downpayment / 100) * $value;
            $prod->downpayment = $downpayment_cost;

            $new_total = $newprice + (($interest_rate / 100) * $newprice);
            $number_of_months = $years * 12;
            $monthly_rate = $new_total / $number_of_months;
            $prod->monthly_payment = number_format((float) $monthly_rate, 2, '.', '');
            $prod->total = number_format((float) $new_total, 2, '.', '');

            return $prod;
        }


        $new_total = $value + (($interest_rate / 100) * $value);
        $prod->total = number_format((float) $new_total, 2, '.', '');

        $monthly_payment = $new_total / $months;
        $prod->monthly_payment = number_format((float) $monthly_payment, 2, '.', '');

        return $prod;
    }

}
