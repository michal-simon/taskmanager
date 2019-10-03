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
use App\Brand;

$factory->define(Brand::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->company,
        'website' => $faker->url,
        'phone_number' => $faker->phoneNumber,
        'email' => $faker->email,
        'address_1' => $faker->streetName,
        'address_2' => $faker->streetAddress,
        'town' => $faker->word,
        'city' => $faker->city,
        'postcode' => $faker->postcode
    ];
});
