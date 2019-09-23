<?php

/*
  |--------------------------------------------------------------------------
  | Model Factories
  |--------------------------------------------------------------------------
  |
  | Here you may define all of your model factories. Model factories give
  | you a convenient way to create models for testing and seeding your
  | database. Just tell the factory how a default model should look.
  |
 */

/** @var \Illuminate\Database\Eloquent\Factory $factory */
use App\Product;

$factory->define(Product::class, function (Faker\Generator $faker) {
    $product = $faker->unique()->sentence;

    return [
        'sku' => $faker->numberBetween(1111111, 999999),
        'name' => $product,
        'slug' => str_slug($product),
        'description' => $faker->paragraph,
        'price' => $faker->randomNumber(2),
        'status' => 1
    ];
});
