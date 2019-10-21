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
use App\Customer;
use App\Brand;

$factory->define(Customer::class, function (Faker\Generator $faker) {

    $company = factory(Brand::class)->create();

    return [
        'phone' => $faker->phoneNumber,
        'company_id' => $company->id,
        'job_title' => $faker->jobTitle,
        'first_name' => $faker->firstName,
        'last_name' => $faker->lastName,
        'email' => $faker->unique()->safeEmail,
        'status' => 1
    ];
});
