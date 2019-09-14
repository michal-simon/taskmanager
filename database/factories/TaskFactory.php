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
use App\Task;
use Faker\Generator as Faker;
$factory->define(Task::class, function (Faker $faker) {
    return [
        'title' => $faker->text,
        'content' => $faker->text,
        'is_completed' => 0,
        'contributors' => 101,
        'task_color' => 'colorBlue',
        'due_date' => $faker->dateTime(),
        'task_type' => 2
    ];
});