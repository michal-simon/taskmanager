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
use App\File;
use App\Task;
use App\User;

$factory->define(File::class, function (Faker $faker) {
    $user = factory(User::class)->create();
    $task = factory(Task::class)->create();
    
    return [
        'is_active' => 1,
        'task_id' => $task->id,
        'user_id' => $user->id,
        'filename' => $faker->text,
        'file_path' => $faker->word,
    ];
});
