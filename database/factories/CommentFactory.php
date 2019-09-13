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
use App\Comment;
$factory->define(Comment::class, function (Faker $faker) {
    return [
        'is_active' => 1,
        'task_id' => 5,
        'user_id' => 1,
        'comment' => $faker->text,
    ];
});