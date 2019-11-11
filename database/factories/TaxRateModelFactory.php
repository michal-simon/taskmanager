
<?php
use App\TaxRate

$factory->define(TaxRate::class, function (Faker\Generator $faker) {
    
    return [
        'name' => $faker->word,
        'rate' => $faker->randomFloat()
    ];
});
