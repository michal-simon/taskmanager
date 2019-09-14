<?php
use Faker\Generator as Faker;
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
use App\Project;
$factory->define(Project::class, function (Faker $faker) {
    return [
        'customer_id' => null,
        'title' => $faker->text,
        'description' => $faker->text,
        'created_by' => $faker->firstNameMale,
        'is_completed' => 0,
    ];
});