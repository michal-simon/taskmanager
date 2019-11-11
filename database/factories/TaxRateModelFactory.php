
<?php
use App\TaxRate

$factory->define(TaxRate::class, function (Faker\Generator $faker) {
    
    return [
        'name' => $faker->sentence
        'rate' => $faker->randomFloat()
    ];
});
